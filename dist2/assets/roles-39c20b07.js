import{a as w}from"./axios-47b9d439.js";import{_ as m,r as h,b as d,e as g,k as b,g as p,c as i,w as r,F as L,m as u,i as x,p as y,l as k}from"./index-dbaeffc6.js";const v=async a=>await w.get("/api/files/download",{params:{filename:a}}).then(s=>s);const U=a=>(y("data-v-c2d49ea6"),a=a(),k(),a),I=U(()=>p("h1",null,[p("span",null,"文件上传")],-1)),R={__name:"roles",setup(a){const s=h([]),_=e=>{const o=e.file.status;o==="done"?(u.success(`${e.file.name} file uploaded successfully.`),console.log(e.fileList[0])):o==="error"&&u.error(`${e.file.name} file upload failed.`)},f=async e=>{console.log("download!!"),console.log(e.response),await v(e.response).then(o=>{const t=document.createElement("a");let n=new Blob([o.data],{type:"application/octet-stream"});t.style.display="none";const l=window.URL||window.webkitURL||window.moxURL;t.href=l.createObjectURL(n);const c=o.config.params.filename.toString().split("-")[1];t.download=c,t.click(),window.URL.revokeObjectURL(l)})};return(e,o)=>{const t=d("upload-outlined"),n=d("a-button"),l=d("a-upload");return g(),b(L,null,[I,p("h1",null,[i(l,{class:"upload","file-list":s.value,"onUpdate:fileList":o[0]||(o[0]=c=>s.value=c),action:"/api/files/upload","show-upload-list":{showDownloadIcon:!0},onChange:_,onDownload:f},{default:r(()=>[i(n,null,{default:r(()=>[i(t),x(" 点击文件上传 ")]),_:1})]),_:1},8,["file-list"])])],64)}}},S=m(R,[["__scopeId","data-v-c2d49ea6"]]);export{S as default};