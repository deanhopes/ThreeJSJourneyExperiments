(function(t){function e(t,i){if({}.hasOwnProperty.call(e.cache,t))return e.cache[t];var r=e.resolve(t);if(!r)throw new Error("Failed to resolve module "+t);var s={id:t,require:e,filename:t,exports:{},loaded:!1,parent:i,children:[]};i&&i.children.push(s);var o=t.slice(0,t.lastIndexOf("/")+1);return e.cache[t]=s.exports,r.call(s.exports,s,s.exports,o,t),s.loaded=!0,e.cache[t]=s.exports}e.modules={},e.cache={},e.resolve=function(t){return{}.hasOwnProperty.call(e.modules,t)?e.modules[t]:void 0},e.define=function(t,i){e.modules[t]=i},e.define("/gif.worker.coffee",(function(t,i,r,s){var o,n;o=e("/GIFEncoder.js",t),n=function(t){var e,i,r,s;return e=new o(t.width,t.height),0===t.index?e.writeHeader():e.firstFrame=!1,e.setTransparent(t.transparent),e.setRepeat(t.repeat),e.setDelay(t.delay),e.setQuality(t.quality),e.addFrame(t.data),t.last&&e.finish(),r=e.stream(),t.data=r.pages,t.cursor=r.cursor,t.pageSize=r.constructor.pageSize,t.canTransfer?(s=function(e){for(var r=0,s=t.data.length;r<s;++r)i=t.data[r],e.push(i.buffer);return e}.call(this,[]),self.postMessage(t,s)):self.postMessage(t)},self.onmessage=function(t){return n(t.data)}})),e.define("/GIFEncoder.js",(function(t,i,r,s){function o(){this.page=-1,this.pages=[],this.newPage()}function n(t,e){this.width=~~t,this.height=~~e,this.transparent=null,this.transIndex=0,this.repeat=-1,this.delay=0,this.image=null,this.pixels=null,this.indexedPixels=null,this.colorDepth=null,this.colorTab=null,this.usedEntry=new Array,this.palSize=7,this.dispose=-1,this.firstFrame=!0,this.sample=10,this.out=new o}var a=e("/TypedNeuQuant.js",t),h=e("/LZWEncoder.js",t);o.pageSize=4096,o.charMap={};for(var u=0;u<256;u++)o.charMap[u]=String.fromCharCode(u);o.prototype.newPage=function(){this.pages[++this.page]=new Uint8Array(o.pageSize),this.cursor=0},o.prototype.getData=function(){for(var t="",e=0;e<this.pages.length;e++)for(var i=0;i<o.pageSize;i++)t+=o.charMap[this.pages[e][i]];return t},o.prototype.writeByte=function(t){this.cursor>=o.pageSize&&this.newPage(),this.pages[this.page][this.cursor++]=t},o.prototype.writeUTFBytes=function(t){for(var e=t.length,i=0;i<e;i++)this.writeByte(t.charCodeAt(i))},o.prototype.writeBytes=function(t,e,i){for(var r=i||t.length,s=e||0;s<r;s++)this.writeByte(t[s])},n.prototype.setDelay=function(t){this.delay=Math.round(t/10)},n.prototype.setFrameRate=function(t){this.delay=Math.round(100/t)},n.prototype.setDispose=function(t){t>=0&&(this.dispose=t)},n.prototype.setRepeat=function(t){this.repeat=t},n.prototype.setTransparent=function(t){this.transparent=t},n.prototype.addFrame=function(t){this.image=t,this.getImagePixels(),this.analyzePixels(),this.firstFrame&&(this.writeLSD(),this.writePalette(),this.repeat>=0&&this.writeNetscapeExt()),this.writeGraphicCtrlExt(),this.writeImageDesc(),this.firstFrame||this.writePalette(),this.writePixels(),this.firstFrame=!1},n.prototype.finish=function(){this.out.writeByte(59)},n.prototype.setQuality=function(t){t<1&&(t=1),this.sample=t},n.prototype.writeHeader=function(){this.out.writeUTFBytes("GIF89a")},n.prototype.analyzePixels=function(){var t=this.pixels.length/3;this.indexedPixels=new Uint8Array(t);var e=new a(this.pixels,this.sample);e.buildColormap(),this.colorTab=e.getColormap();for(var i=0,r=0;r<t;r++){var s=e.lookupRGB(255&this.pixels[i++],255&this.pixels[i++],255&this.pixels[i++]);this.usedEntry[s]=!0,this.indexedPixels[r]=s}this.pixels=null,this.colorDepth=8,this.palSize=7,null!==this.transparent&&(this.transIndex=this.findClosest(this.transparent))},n.prototype.findClosest=function(t){if(null===this.colorTab)return-1;for(var e=(16711680&t)>>16,i=(65280&t)>>8,r=255&t,s=0,o=16777216,n=this.colorTab.length,a=0;a<n;){var h=e-(255&this.colorTab[a++]),u=i-(255&this.colorTab[a++]),p=r-(255&this.colorTab[a]),l=h*h+u*u+p*p,f=parseInt(a/3);this.usedEntry[f]&&l<o&&(o=l,s=f),a++}return s},n.prototype.getImagePixels=function(){var t=this.width,e=this.height;this.pixels=new Uint8Array(t*e*3);for(var i=this.image,r=0,s=0;s<e;s++)for(var o=0;o<t;o++){var n=s*t*4+4*o;this.pixels[r++]=i[n],this.pixels[r++]=i[n+1],this.pixels[r++]=i[n+2]}},n.prototype.writeGraphicCtrlExt=function(){var t,e;this.out.writeByte(33),this.out.writeByte(249),this.out.writeByte(4),null===this.transparent?(t=0,e=0):(t=1,e=2),this.dispose>=0&&(e=7&dispose),e<<=2,this.out.writeByte(0|e|t),this.writeShort(this.delay),this.out.writeByte(this.transIndex),this.out.writeByte(0)},n.prototype.writeImageDesc=function(){this.out.writeByte(44),this.writeShort(0),this.writeShort(0),this.writeShort(this.width),this.writeShort(this.height),this.firstFrame?this.out.writeByte(0):this.out.writeByte(128|this.palSize)},n.prototype.writeLSD=function(){this.writeShort(this.width),this.writeShort(this.height),this.out.writeByte(240|this.palSize),this.out.writeByte(0),this.out.writeByte(0)},n.prototype.writeNetscapeExt=function(){this.out.writeByte(33),this.out.writeByte(255),this.out.writeByte(11),this.out.writeUTFBytes("NETSCAPE2.0"),this.out.writeByte(3),this.out.writeByte(1),this.writeShort(this.repeat),this.out.writeByte(0)},n.prototype.writePalette=function(){this.out.writeBytes(this.colorTab);for(var t=768-this.colorTab.length,e=0;e<t;e++)this.out.writeByte(0)},n.prototype.writeShort=function(t){this.out.writeByte(255&t),this.out.writeByte(t>>8&255)},n.prototype.writePixels=function(){new h(this.width,this.height,this.indexedPixels,this.colorDepth).encode(this.out)},n.prototype.stream=function(){return this.out},t.exports=n})),e.define("/LZWEncoder.js",(function(t,e,i,r){var s=5003,o=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];t.exports=function(t,e,i,r){function n(t,e){B[y++]=t,y>=254&&p(e)}function a(t){h(s),I=v+2,T=!0,c(v,t)}function h(t){for(var e=0;e<t;++e)b[e]=-1}function u(t,e){var i,r,o,n,u,p;for(g=t,T=!1,n_bits=g,d=l(n_bits),x=1+(v=1<<t-1),I=v+2,y=0,n=f(),p=0,i=s;i<65536;i*=2)++p;p=8-p,h(s),c(v,e);t:for(;-1!=(r=f());)if(i=(r<<12)+n,b[o=r<<p^n]!==i){if(b[o]>=0){u=5003-o,0===o&&(u=1);do{if((o-=u)<0&&(o+=5003),b[o]===i){n=S[o];continue t}}while(b[o]>=0)}c(n,e),n=r,I<4096?(S[o]=I++,b[o]=i):a(e)}else n=S[o];c(n,e),c(x,e)}function p(t){y>0&&(t.writeByte(y),t.writeBytes(B,0,y),y=0)}function l(t){return(1<<t)-1}function f(){return 0===remaining?-1:(--remaining,255&i[curPixel++])}function c(t,e){for(w&=o[P],P>0?w|=t<<P:w=t,P+=n_bits;P>=8;)n(255&w,e),w>>=8,P-=8;if((I>d||T)&&(T?(d=l(n_bits=g),T=!1):(++n_bits,d=12==n_bits?4096:l(n_bits))),t==x){for(;P>0;)n(255&w,e),w>>=8,P-=8;p(e)}}var w,y,d,g,v,x,m=Math.max(2,r),B=new Uint8Array(256),b=new Int32Array(s),S=new Int32Array(s),P=0,I=0,T=!1;this.encode=function(i){i.writeByte(m),remaining=t*e,curPixel=0,u(m+1,i),i.writeByte(0)}}})),e.define("/TypedNeuQuant.js",(function(t,e,i,r){var s=256,o=1024,n=1<<18;t.exports=function(t,e){function i(t,e,i,r,s){h[e][0]-=t*(h[e][0]-i)/o,h[e][1]-=t*(h[e][1]-r)/o,h[e][2]-=t*(h[e][2]-s)/o}function r(t,e,i,r,o){for(var a,u,p=Math.abs(e-t),l=Math.min(e+t,s),c=e+1,w=e-1,y=1;c<l||w>p;)u=f[y++],c<l&&((a=h[c++])[0]-=u*(a[0]-i)/n,a[1]-=u*(a[1]-r)/n,a[2]-=u*(a[2]-o)/n),w>p&&((a=h[w--])[0]-=u*(a[0]-i)/n,a[1]-=u*(a[1]-r)/n,a[2]-=u*(a[2]-o)/n)}function a(t,e,i){var r,o,n,a,u,f=2147483647,c=f,w=-1,y=w;for(r=0;r<s;r++)o=h[r],(n=Math.abs(o[0]-t)+Math.abs(o[1]-e)+Math.abs(o[2]-i))<f&&(f=n,w=r),(a=n-(p[r]>>12))<c&&(c=a,y=r),u=l[r]>>10,l[r]-=u,p[r]+=u<<10;return l[w]+=64,p[w]-=65536,y}var h,u,p,l,f;this.buildColormap=function(){(function(){var t,e;for(h=[],u=new Int32Array(256),p=new Int32Array(s),l=new Int32Array(s),f=new Int32Array(32),t=0;t<s;t++)e=(t<<12)/s,h[t]=new Float64Array([e,e,e,0]),l[t]=256,p[t]=0})(),function(){var s,n,h=t.length,u=30+(e-1)/3,p=h/(3*e),l=~~(p/100),c=o,w=2048,y=w>>6;for(y<=1&&(y=0),s=0;s<y;s++)f[s]=c*(256*(y*y-s*s)/(y*y));h<1509?(e=1,n=3):n=h%499!=0?1497:h%491!=0?1473:h%487!=0?1461:1509;var d,g,v,x,m=0;for(s=0;s<p;)if(i(c,x=a(d=(255&t[m])<<4,g=(255&t[m+1])<<4,v=(255&t[m+2])<<4),d,g,v),0!==y&&r(y,x,d,g,v),(m+=n)>=h&&(m-=h),0===l&&(l=1),++s%l==0)for(c-=c/u,(y=(w-=w/30)>>6)<=1&&(y=0),x=0;x<y;x++)f[x]=c*(256*(y*y-x*x)/(y*y))}(),function(){for(var t=0;t<s;t++)h[t][0]>>=4,h[t][1]>>=4,h[t][2]>>=4,h[t][3]=t}(),function(){var t,e,i,r,o,n,a=0,p=0;for(t=0;t<s;t++){for(o=t,n=(i=h[t])[1],e=t+1;e<s;e++)(r=h[e])[1]<n&&(o=e,n=r[1]);if(r=h[o],t!=o&&(e=r[0],r[0]=i[0],i[0]=e,e=r[1],r[1]=i[1],i[1]=e,e=r[2],r[2]=i[2],i[2]=e,e=r[3],r[3]=i[3],i[3]=e),n!=a){for(u[a]=p+t>>1,e=a+1;e<n;e++)u[e]=t;a=n,p=t}}for(u[a]=p+255>>1,e=a+1;e<256;e++)u[e]=255}()},this.getColormap=function(){for(var t=[],e=[],i=0;i<s;i++)e[h[i][3]]=i;for(var r=0,o=0;o<s;o++){var n=e[o];t[r++]=h[n][0],t[r++]=h[n][1],t[r++]=h[n][2]}return t},this.lookupRGB=function(t,e,i){for(var r,o,n,a=1e3,p=-1,l=u[e],f=l-1;l<s||f>=0;)l<s&&((n=(o=h[l])[1]-e)>=a?l=s:(l++,n<0&&(n=-n),(r=o[0]-t)<0&&(r=-r),(n+=r)<a&&((r=o[2]-i)<0&&(r=-r),(n+=r)<a&&(a=n,p=o[3])))),f>=0&&((n=e-(o=h[f])[1])>=a?f=-1:(f--,n<0&&(n=-n),(r=o[0]-t)<0&&(r=-r),(n+=r)<a&&((r=o[2]-i)<0&&(r=-r),(n+=r)<a&&(a=n,p=o[3]))));return p}}})),e("/gif.worker.coffee")}).call(this,this);