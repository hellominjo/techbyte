import siteConfig from "@/site.config";
import techbyteIcon from "@/app/techbyte.ico";
import { siteValue } from "@/lib/site";

const subdomain = siteConfig.brandName.toLowerCase();
const siteName = siteValue("siteName", "ko");
const tagline = siteValue("tagline", "ko");

// 접속한 주소가 brandName 서브도메인(techbyte.zerofound.io, 로컬 확인용 techbyte.localhost)이면
// - <html data-brand="techbyte">를 붙임 (globals.css의 techbyte: variant → 헤더 로고)
// - 탭 제목 끝의 siteName(ZEROFOUND)을 tagline(TECHBYTE)으로 바꿈
// - 탭 아이콘을 app/techbyte.ico로 바꿈
// 페이지를 이동하면 Next가 제목·아이콘을 다시 쓰므로 <head> 변화를 지켜보며 계속 맞춤.
// 호스트 이름은 소문자라 brandName도 소문자로 비교. 첫 페인트 전에 실행되어 깜빡이지 않음
export const brandInitScript = `(function(){try{
if(location.hostname.indexOf(${JSON.stringify(`${subdomain}.`)})!==0)return;
document.documentElement.setAttribute("data-brand","techbyte");
var from=${JSON.stringify(siteName)},to=${JSON.stringify(tagline)},icon=${JSON.stringify(techbyteIcon.src)};
function apply(){
  var t=document.title;
  if(t.slice(-from.length)===from)document.title=t.slice(0,-from.length)+to;
  var links=document.querySelectorAll('link[rel~="icon"]');
  for(var i=0;i<links.length;i++)if(links[i].getAttribute("href")!==icon){links[i].setAttribute("href",icon);links[i].removeAttribute("sizes");links[i].setAttribute("type","image/x-icon")}
  if(!links.length&&document.head){var l=document.createElement("link");l.rel="icon";l.href=icon;document.head.appendChild(l)}
}
apply();
document.addEventListener("DOMContentLoaded",apply);
new MutationObserver(apply).observe(document.head||document.documentElement,{childList:true,subtree:true,characterData:true});
}catch(e){}})()`;
