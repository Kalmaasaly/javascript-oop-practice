
const interval=setInterval(()=>{
    console.log("Processing Analytics.....");
},2000);


document.getElementById("stop-analytics-btn").addEventListener('click',()=>{
    clearInterval(interval);

    console.log(" Analytics stopped! ");
})
