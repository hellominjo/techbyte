import siteConfig from "@/site.config";

// 접속한 주소가 brandName 서브도메인(techbyte.zerofound.io, 로컬 확인용 techbyte.localhost)이면
// <html data-brand="techbyte">를 붙임. 호스트 이름은 소문자라 brandName도 소문자로 비교.
// <head>에서 첫 페인트 전에 실행되어 로고가 바뀌며 깜빡이지 않음 (globals.css의 techbyte: variant)
export const brandInitScript = `(function(){try{if(location.hostname.indexOf("${siteConfig.brandName.toLowerCase()}.")===0)document.documentElement.setAttribute("data-brand","techbyte")}catch(e){}})()`;
