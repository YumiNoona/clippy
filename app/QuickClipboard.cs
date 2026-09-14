using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Text;
using System.IO;
using System.Net;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using System.Windows.Forms;

public sealed class LoopHotkey : NativeWindow, IDisposable {
  [DllImport("user32.dll")] static extern bool RegisterHotKey(IntPtr h, int id, uint modifiers, uint key);
  [DllImport("user32.dll")] static extern bool UnregisterHotKey(IntPtr h, int id);
  public event EventHandler Pressed;
  public bool Registered { get; private set; }
  public LoopHotkey() { CreateHandle(new CreateParams()); Registered=RegisterHotKey(Handle,1,0x4003,0x56); }
  protected override void WndProc(ref Message m) { if(m.Msg==0x312 && Pressed!=null)Pressed(this,EventArgs.Empty);base.WndProc(ref m); }
  public void Dispose(){if(Registered)UnregisterHotKey(Handle,1);DestroyHandle();}
}
public sealed class LoopQuickClip {
  public string id {get;set;}
  public string title {get;set;}
  public string content {get;set;}
  public bool pinned {get;set;}
}
public sealed class LoopQuickWindow : Form {
  [DllImport("gdi32.dll",CharSet=CharSet.Unicode)] static extern int AddFontResourceEx(string name,uint flags,IntPtr unused);
  [DllImport("gdi32.dll",CharSet=CharSet.Unicode)] static extern bool RemoveFontResourceEx(string name,uint flags,IntPtr unused);
  [DllImport("user32.dll")] static extern bool ReleaseCapture();
  [DllImport("user32.dll")] static extern IntPtr SendMessage(IntPtr h,int msg,IntPtr w,IntPtr l);
  readonly string root,url,regular,bold;
  readonly PrivateFontCollection fonts=new PrivateFontCollection();
  readonly JavaScriptSerializer serializer=new JavaScriptSerializer {MaxJsonLength=100000000};
  readonly TextBox search=new TextBox();
  readonly ListBox list=new ListBox();
  readonly Label status=new Label();
  readonly Button clear=new Button();
  readonly Timer refresh=new Timer {Interval=1500};
  List<LoopQuickClip> clips=new List<LoopQuickClip>();
  bool loading,acting;
  Point down; int downIndex=-1;
  string lastSnapshot="";
  public LoopQuickWindow(string appRoot,int port){
    root=appRoot;url="http://127.0.0.1:"+port;
    regular=Path.Combine(root,"fonts","JetBrainsMono-Regular.ttf");bold=Path.Combine(root,"fonts","JetBrainsMono-Bold.ttf");
    foreach(string path in new[]{regular,bold}){AddFontResourceEx(path,0x10,IntPtr.Zero);fonts.AddFontFile(path);}
    Font=new Font(fonts.Families[0],9);Text="Loop - Quick clipboard";
    BackColor=Color.FromArgb(32,32,32);ForeColor=Color.FromArgb(245,245,245);
    FormBorderStyle=FormBorderStyle.None;ShowInTaskbar=false;TopMost=true;StartPosition=FormStartPosition.Manual;
    ClientSize=new Size(360,430);Padding=new Padding(1);KeyPreview=true;AutoScaleMode=AutoScaleMode.Dpi;
    var layout=new TableLayoutPanel {Dock=DockStyle.Fill,ColumnCount=1,RowCount=6,Padding=new Padding(14,8,14,10),BackColor=BackColor,Margin=Padding.Empty};
    layout.RowStyles.Add(new RowStyle(SizeType.Absolute,32));layout.RowStyles.Add(new RowStyle(SizeType.Absolute,42));
    searchRow=new RowStyle(SizeType.Absolute,0);layout.RowStyles.Add(searchRow);
    layout.RowStyles.Add(new RowStyle(SizeType.Percent,100));layout.RowStyles.Add(new RowStyle(SizeType.Absolute,24));layout.RowStyles.Add(new RowStyle(SizeType.Absolute,0));
    var header=new TableLayoutPanel {Dock=DockStyle.Fill,ColumnCount=4,RowCount=1,Margin=Padding.Empty};header.ColumnStyles.Add(new ColumnStyle(SizeType.Percent,100));for(int i=0;i<3;i++)header.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute,30));
    var heading=new Label {Text="Loop",Dock=DockStyle.Fill,Font=new Font(fonts.Families[0],8),TextAlign=ContentAlignment.MiddleLeft,Margin=Padding.Empty};
    heading.MouseDown+=(s,e)=>{if(e.Button==MouseButtons.Left){ReleaseCapture();SendMessage(Handle,0xA1,new IntPtr(2),IntPtr.Zero);}};
    var find=Button("");find.AccessibleName="Search clipboard";find.Click+=(s,e)=>ToggleSearch();find.Paint+=(s,e)=>{e.Graphics.SmoothingMode=System.Drawing.Drawing2D.SmoothingMode.AntiAlias;using(var p=new Pen(ForeColor,1.2f)){e.Graphics.DrawEllipse(p,8,6,9,9);e.Graphics.DrawLine(p,16,14,21,19);}};
    var full=Button("↗");full.AccessibleName="Open full app";full.Click+=(s,e)=>{System.Diagnostics.Process.Start("http://localhost:"+port+"/");Hide();};
    var close=Button("×");close.AccessibleName="Close quick clipboard";close.Click+=(s,e)=>Hide();
    header.Controls.Add(heading,0,0);header.Controls.Add(find,1,0);header.Controls.Add(full,2,0);header.Controls.Add(close,3,0);
    var section=new TableLayoutPanel {Dock=DockStyle.Fill,ColumnCount=2,RowCount=1,Margin=Padding.Empty};section.ColumnStyles.Add(new ColumnStyle(SizeType.Percent,100));section.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute,132));
    section.Controls.Add(new Label {Text="Clipboard",Dock=DockStyle.Fill,TextAlign=ContentAlignment.MiddleLeft,Margin=Padding.Empty},0,0);
    Style(clear);clear.Text="Clear unpinned";clear.Font=new Font(fonts.Families[0],8);clear.ForeColor=Color.FromArgb(184,184,184);clear.AccessibleName="Clear unpinned clips everywhere";clear.Click+=async(s,e)=>await Action("clear",null);section.Controls.Add(clear,1,0);
    search.Dock=DockStyle.Fill;search.BackColor=Color.FromArgb(44,44,44);search.ForeColor=ForeColor;search.BorderStyle=BorderStyle.FixedSingle;search.AccessibleName="Search clipboard";search.Visible=false;search.Margin=new Padding(2,0,2,6);
    search.TextChanged+=(s,e)=>Filter();search.KeyDown+=(s,e)=>{if(e.KeyCode==Keys.Down&&list.Items.Count>0){list.Focus();list.SelectedIndex=0;e.SuppressKeyPress=true;}};
    list.Dock=DockStyle.Fill;list.BackColor=BackColor;list.ForeColor=ForeColor;list.BorderStyle=BorderStyle.None;list.DrawMode=DrawMode.OwnerDrawFixed;list.ItemHeight=88;list.IntegralHeight=false;list.AccessibleName="Clipboard cards; Enter copies, Control P pins, Delete removes";list.Margin=Padding.Empty;
    list.DrawItem+=DrawClip;
    list.MouseDown+=(s,e)=>{down=e.Location;downIndex=list.IndexFromPoint(e.Location);dragging=true;};
    list.MouseUp+=async(s,e)=>{
      dragging=false;int index=list.IndexFromPoint(e.Location);if(acting||downIndex<0||index!=downIndex)return;
      list.SelectedIndex=index;var clip=(LoopQuickClip)list.Items[index];
      if(down.X-e.X>60){await Action("delete",clip);return;}
      if(Math.Abs(down.X-e.X)>12||Math.Abs(down.Y-e.Y)>12)return;
      var bounds=list.GetItemRectangle(index);
      if(e.X>=bounds.Right-40&&e.Y<bounds.Y+39){ShowClipMenu(clip,e.Location);return;}
      if(e.X>=bounds.Right-40&&e.Y>=bounds.Y+48){await Action("pin",clip);return;}
      CopySelected();
    };
    list.MouseCaptureChanged+=(s,e)=>dragging=false;
    list.KeyDown+=async(s,e)=>{if(e.KeyCode==Keys.Enter){CopySelected();e.SuppressKeyPress=true;}else if(e.KeyCode==Keys.Delete){e.SuppressKeyPress=true;await Action("delete",list.SelectedItem as LoopQuickClip);}else if(e.Control&&e.KeyCode==Keys.P){e.SuppressKeyPress=true;await Action("pin",list.SelectedItem as LoopQuickClip);}};
    status.Dock=DockStyle.Fill;status.ForeColor=Color.FromArgb(150,150,150);status.Font=new Font(fonts.Families[0],7);status.TextAlign=ContentAlignment.MiddleLeft;status.Margin=Padding.Empty;
    layout.Controls.Add(header,0,0);layout.Controls.Add(section,0,1);layout.Controls.Add(search,0,2);layout.Controls.Add(list,0,3);layout.Controls.Add(status,0,4);Controls.Add(layout);
    KeyDown+=(s,e)=>{if(e.KeyCode==Keys.Escape){Hide();e.SuppressKeyPress=true;}else if(e.Control&&e.KeyCode==Keys.F){if(!search.Visible)ToggleSearch();search.Focus();search.SelectAll();e.SuppressKeyPress=true;}};
    Deactivate+=(s,e)=>{if(!clipMenu.Visible)Hide();};FormClosing+=(s,e)=>{if(e.CloseReason==CloseReason.UserClosing){e.Cancel=true;Hide();}};
    clipMenu.Font=Font;clipMenu.ShowImageMargin=false;clipMenu.BackColor=Color.FromArgb(44,44,44);clipMenu.ForeColor=ForeColor;
    refresh.Tick+=async(s,e)=>{if(Visible&&!acting&&!dragging&&!clipMenu.Visible)await Reload();};refresh.Start();
  }
  RowStyle searchRow;
  bool dragging;
  readonly ContextMenuStrip clipMenu=new ContextMenuStrip();
  void ToggleSearch(){search.Visible=!search.Visible;searchRow.Height=search.Visible?34:0;if(search.Visible)search.Focus();else{search.Clear();list.Focus();}}
  void Style(Button b){b.Dock=DockStyle.Fill;b.FlatStyle=FlatStyle.Flat;b.FlatAppearance.BorderSize=0;b.FlatAppearance.MouseOverBackColor=Color.FromArgb(52,52,52);b.FlatAppearance.MouseDownBackColor=Color.FromArgb(64,64,64);b.BackColor=BackColor;b.ForeColor=ForeColor;b.Font=Font;b.Cursor=Cursors.Hand;b.Margin=new Padding(0,3,0,3);}
  Button Button(string text){var b=new Button {Text=text};Style(b);return b;}
  void ShowClipMenu(LoopQuickClip clip,Point at){clipMenu.Items.Clear();clipMenu.Items.Add("Copy",null,(s,e)=>CopySelected());clipMenu.Items.Add(clip.pinned?"Unpin":"Pin",null,async(s,e)=>await Action("pin",clip));clipMenu.Items.Add("Delete",null,async(s,e)=>await Action("delete",clip));clipMenu.Show(list,at);}
  static System.Drawing.Drawing2D.GraphicsPath Rounded(Rectangle bounds,int radius){var p=new System.Drawing.Drawing2D.GraphicsPath();int d=radius*2;p.AddArc(bounds.X,bounds.Y,d,d,180,90);p.AddArc(bounds.Right-d,bounds.Y,d,d,270,90);p.AddArc(bounds.Right-d,bounds.Bottom-d,d,d,0,90);p.AddArc(bounds.X,bounds.Bottom-d,d,d,90,90);p.CloseFigure();return p;}
  protected override CreateParams CreateParams {get{var cp=base.CreateParams;cp.ClassStyle|=0x20000;return cp;}}
  protected override void OnResize(EventArgs e){base.OnResize(e);if(Width>24&&Height>24)using(var shape=Rounded(new Rectangle(0,0,Width,Height),10)){var old=Region;Region=new Region(shape);if(old!=null)old.Dispose();}}
  protected override void OnPaint(PaintEventArgs e){base.OnPaint(e);e.Graphics.SmoothingMode=System.Drawing.Drawing2D.SmoothingMode.AntiAlias;using(var path=Rounded(new Rectangle(0,0,Width-1,Height-1),10))using(var p=new Pen(Color.FromArgb(67,67,67)))e.Graphics.DrawPath(p,path);}
  protected override void Dispose(bool disposing){if(disposing){refresh.Stop();refresh.Dispose();clipMenu.Dispose();base.Dispose(disposing);fonts.Dispose();RemoveFontResourceEx(regular,0x10,IntPtr.Zero);RemoveFontResourceEx(bold,0x10,IntPtr.Zero);}else base.Dispose(disposing);}
  WebClient Client(){var c=new WebClient();c.Proxy=null;c.Encoding=System.Text.Encoding.UTF8;c.Headers.Add("Authorization","Bearer "+File.ReadAllText(Path.Combine(root,"data","access-key.txt")).Trim());return c;}
  public async void TogglePanel(){if(Visible){Hide();return;}var area=Screen.FromPoint(Cursor.Position).WorkingArea;Height=Math.Min(430,area.Height-24);Width=Math.Min(360,area.Width-24);Location=new Point(area.Right-Width-12,area.Bottom-Height-12);Show();Activate();if(search.Visible)search.Focus();else list.Focus();await Reload();}
  public async Task Reload(){if(loading||IsDisposed)return;loading=true;
    try{using(var c=Client()){string json=await c.DownloadStringTaskAsync(url+"/api/quick");if(IsDisposed || json==lastSnapshot)return;lastSnapshot=json;clips=serializer.Deserialize<List<LoopQuickClip>>(json);Filter();}}
    catch{if(!IsDisposed)status.Text="Loop unavailable. Start it from the tray.";}finally{loading=false;}
  }
  void Filter(){var previous=list.SelectedItem as LoopQuickClip;string selected=previous==null?null:previous.id;int top=list.TopIndex;list.BeginUpdate();list.Items.Clear();foreach(var clip in clips)if((clip.title+"\n"+clip.content).IndexOf(search.Text,StringComparison.OrdinalIgnoreCase)>=0)list.Items.Add(clip);for(int i=0;i<list.Items.Count;i++)if(((LoopQuickClip)list.Items[i]).id==selected)list.SelectedIndex=i;if(list.SelectedIndex<0&&list.Items.Count>0)list.SelectedIndex=0;if(list.Items.Count>0)list.TopIndex=Math.Min(top,list.Items.Count-1);list.EndUpdate();status.Text=list.Items.Count==0?"No matching text clips. Copy something to begin.":"Enter copy · Ctrl+P pin · Del remove";}
  void DrawClip(object sender,DrawItemEventArgs e){
    if(e.Index<0)return;var clip=(LoopQuickClip)list.Items[e.Index];bool selected=(e.State&DrawItemState.Selected)!=0;
    e.Graphics.SmoothingMode=System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
    var card=new Rectangle(e.Bounds.X+2,e.Bounds.Y+3,e.Bounds.Width-5,e.Bounds.Height-8);
    using(var shape=Rounded(card,7))using(var bg=new SolidBrush(selected?Color.FromArgb(48,48,48):Color.FromArgb(43,43,43))){e.Graphics.FillPath(bg,shape);if(selected)using(var border=new Pen(Color.FromArgb(224,224,224),1.5f))e.Graphics.DrawPath(border,shape);}
    string preview=clip.content.Replace("\r","").Replace("\t","  ");
    TextRenderer.DrawText(e.Graphics,preview,Font,new Rectangle(card.X+9,card.Y+10,card.Width-47,43),ForeColor,TextFormatFlags.WordBreak|TextFormatFlags.EndEllipsis|TextFormatFlags.NoPrefix|TextFormatFlags.NoPadding);
    using(var dots=new SolidBrush(Color.FromArgb(204,204,204)))for(int i=0;i<3;i++)e.Graphics.FillEllipse(dots,card.Right-24+i*4,card.Y+15,2,2);
    var saved=e.Graphics.Save();e.Graphics.TranslateTransform(card.Right-18,card.Bottom-17);e.Graphics.RotateTransform(35);
    using(var pen=new Pen(clip.pinned?ForeColor:Color.FromArgb(160,160,160),1.4f))using(var brush=new SolidBrush(ForeColor)){
      var pin=new[]{new Point(-4,-6),new Point(4,-6),new Point(3,-4),new Point(3,0),new Point(5,2),new Point(-5,2),new Point(-3,0),new Point(-3,-4)};
      if(clip.pinned)e.Graphics.FillPolygon(brush,pin);else e.Graphics.DrawPolygon(pen,pin);e.Graphics.DrawLine(pen,0,2,0,8);
    }
    e.Graphics.Restore(saved);
  }
  void CopySelected(){var clip=list.SelectedItem as LoopQuickClip;if(clip==null)return;try{if(clip.content.Length>0)Clipboard.SetText(clip.content);LoopClipboardCapture.IgnoreCurrent();Hide();}catch{status.Text="Clipboard busy. Try again.";}}
  async Task Action(string action,LoopQuickClip clip){if(acting||IsDisposed||(action!="clear"&&clip==null))return;acting=true;clear.Enabled=false;
    try{using(var c=Client()){c.Headers[HttpRequestHeader.ContentType]="application/json";await c.UploadStringTaskAsync(url+"/api/quick-action","POST",serializer.Serialize(new{action=action,id=clip==null?null:clip.id,pinned=clip==null?false:!clip.pinned}));}if(!IsDisposed){await Reload();status.Text=action=="clear"?"Unpinned clips cleared everywhere. Pins kept.":"Saved to your shared library.";}}
    catch{if(!IsDisposed)status.Text="Could not save. Check the PC server.";}finally{acting=false;if(!IsDisposed)clear.Enabled=true;}
  }
}
// Runs on the tray's STA thread, even while all browser windows are closed.
public sealed class LoopClipboardCapture : IDisposable {
  [DllImport("user32.dll")] static extern uint GetClipboardSequenceNumber();
  static uint ignored;
  readonly Timer timer=new Timer {Interval=500};
  readonly Queue<object> pending=new Queue<object>();
  readonly JavaScriptSerializer serializer=new JavaScriptSerializer {MaxJsonLength=16000000};
  readonly string root,url;
  uint sequence; bool sending,disposed;
  public bool Enabled {get;set;}
  public string Status {get;private set;}
  public static void IgnoreCurrent(){ignored=GetClipboardSequenceNumber();}
  public LoopClipboardCapture(string appRoot,int port){root=appRoot;url="http://127.0.0.1:"+port;sequence=GetClipboardSequenceNumber();Enabled=true;Status="Auto capture on";timer.Tick+=async(s,e)=>await Tick();timer.Start();}
  void Add(string type,string title,string content,object meta){
    if(pending.Count>=100){Status="Capture queue full; start Loop to send clips";return;}
    string id="capture-"+Guid.NewGuid().ToString("N");long now=DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
    pending.Enqueue(new{id=id,type=type,title=title.Length>200?title.Substring(0,200):title,content=content,meta=meta,device="windows-capture",ts=now,updatedAt=now,pinned=false,fav=false,deleted=false,mutation=id,rev=0});
  }
  async Task Tick(){
    if(disposed)return;
    uint current=GetClipboardSequenceNumber();
    if(!Enabled){sequence=current;Status="Auto capture paused";return;}
    if(current!=sequence){
      if(current==ignored)sequence=current;
      else try{
        if(Clipboard.ContainsData("ExcludeClipboardContentFromMonitorProcessing")){sequence=current;return;}
        if(Clipboard.ContainsFileDropList()){
          foreach(string path in Clipboard.GetFileDropList()){
            var info=new FileInfo(path);if(!info.Exists || info.Length>2*1024*1024){Status="Skipped folder or file above 2 MB";continue;}
            byte[] bytes=File.ReadAllBytes(path);string name=Path.GetFileName(path);
            Add("file",name,"",new{dataUrl="data:application/octet-stream;base64,"+Convert.ToBase64String(bytes),ext=info.Extension.TrimStart('.'),size=(bytes.Length/1024)+" KB"});
          }
        }else if(Clipboard.ContainsImage()){
          using(var img=Clipboard.GetImage())using(var stream=new MemoryStream()){
            img.Save(stream,System.Drawing.Imaging.ImageFormat.Png);
            if(stream.Length<=2*1024*1024)Add("image","Copied image","",new{dataUrl="data:image/png;base64,"+Convert.ToBase64String(stream.ToArray()),dims=img.Width+"×"+img.Height,size=(stream.Length/1024)+" KB"});
            else Status="Skipped image above 2 MB";
          }
        }else if(Clipboard.ContainsText()){
          string text=Clipboard.GetText();if(!String.IsNullOrWhiteSpace(text)&&text.Length<=1000000){string title=text.Split('\n')[0];Add(System.Text.RegularExpressions.Regex.IsMatch(text,@"^https?://\S+$")?"link":"text",title.Length>64?title.Substring(0,64):title,text,null);}
        }
        sequence=current;
      }catch{Status="Clipboard busy; retrying";}
    }
    if(sending || pending.Count==0)return;
    sending=true;
    try{
      using(var client=new WebClient()){
        client.Proxy=null;client.Encoding=System.Text.Encoding.UTF8;client.Headers.Add("Authorization","Bearer "+File.ReadAllText(Path.Combine(root,"data","access-key.txt")).Trim());client.Headers[HttpRequestHeader.ContentType]="application/json";
        var item=serializer.Deserialize<Dictionary<string,object>>(serializer.Serialize(pending.Peek()));
        bool existing=false;
        if((string)item["type"]=="text" || (string)item["type"]=="link"){
          var recent=serializer.Deserialize<List<LoopQuickClip>>(await client.DownloadStringTaskAsync(url+"/api/quick"));
          existing=recent.Exists(clip=>clip.content==(string)item["content"]);
        }
        if(!existing)await client.UploadStringTaskAsync(url+"/api/sync","POST",serializer.Serialize(new{items=new[]{pending.Peek()},device=new{id="windows-capture",name="Windows clipboard",type="desktop"}}));
        if(!disposed){pending.Dequeue();Status="Auto capture on";}
      }
    }catch{if(!disposed)Status="Copies queued; waiting for Loop";}finally{sending=false;}
  }
  public void Dispose(){disposed=true;timer.Stop();timer.Dispose();}
}



