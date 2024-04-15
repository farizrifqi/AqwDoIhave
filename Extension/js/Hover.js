var currentMousePos = { x: -1, y: -1 };
document.addEventListener("mousemove", (e) => {
    currentMousePos.x = e.x;
    currentMousePos.y = e.y;
});
// document.addEventListener("mouseenter", (e) => {
//     console.log(e)
// });


function handleMouseEnter(event) {
    console.log("ok")
    // var currentMousePos = { x: event.clientX, y: event.clientY };
    var target = event.target || event.srcElement;

    var previewDiv = document.createElement("div");
    previewDiv.id = "preview";
    previewDiv.style.position = "absolute";
    previewDiv.style.zIndex = "9999";
    previewDiv.innerHTML = "<iframe frameborder='0' scrolling='no' width='2500px' height='800px' src='//lel.wtf/wikimg.php?page=" + target.href + "'></iframe>";

    document.body.appendChild(previewDiv);

    previewDiv.style.top = (currentMousePos.y - 200) + "px";
    previewDiv.style.left = (currentMousePos.x + 100) + "px";
}

// Define a function to handle mouseleave event
function handleMouseLeave() {
    var previewDiv = document.getElementById("preview");
    if (previewDiv) {
        previewDiv.remove();
    }
}

var elements = document.querySelectorAll("a.item, div.item > div > a, div.title > a, div.list-pages-item > p > a, div.collapsible-block-content > a, div.collapsible-block-content > p > a, div.yui-content > div > a, div.yui-content > div > p > a, div.list-pages-box > p > a, #page-content > ul > li > a, #page-content > ul > li > span > a, #page-content > ul > li > ul > li > a, div.yui-content > div > ul > li > ul > li > a, #page-content > a, #page-content > p > a, tr > td > a");
// console.log({ elements })
elements.forEach(function (element) {
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
});