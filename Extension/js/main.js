/* Main.js */ 

const bank_icon = chrome.runtime.getURL("images/in_bank.png")
const inv_icon = chrome.runtime.getURL("images/in_inventory.png")
const price_icon = chrome.runtime.getURL("images/price_icon.png");
const drop_icon = chrome.runtime.getURL("images/monster_drop.png")
const collectionchest_icon = chrome.runtime.getURL("images/collectionchest_icon.png")
const inventory_update_icon = chrome.runtime.getURL("images/update_inventory.png")
var found = 0 



// Wait and Process acount data
function waitForTableToLoad(){
		if(typeof document.getElementById("listinvFull").innerHTML.length !== "undefined"){
			if(document.getElementById("listinvFull").innerHTML.length >= 2000){
				processAcount();
			} 
			else {
				setTimeout(waitForTableToLoad, 250);
			}	
		} 
		else {
			setTimeout(waitForTableToLoad, 250);
	}
}

function processAcountBackground() {
	var prevurl = document.location.href 
	chrome.storage.local.set({"background": prevurl}, function() {});
	document.location.href = "https://account.aq.com/AQW/Inventory"

	
}


function processAcount() {
	
	var data = ProcessAccountItems();
	
	// Save Items to local Storage 
	chrome.storage.local.set({"aqwitems": data[0]}, function() {});
	chrome.storage.local.set({"aqwwhere": data[1]}, function() {});
	chrome.storage.local.set({"aqwtype": data[2]}, function() {});
	chrome.storage.local.set({"aqwbuy": data[3]}, function() {});
	chrome.storage.local.set({"aqwcategory": data[4]}, function() {});
	
	chrome.storage.local.get({background: false}, function(result){
		if (result.background !== false) {
			document.location.href = result.background
			chrome.storage.local.set({"background": false}, function() {});
		} 
		
	});
	
}




// Account Page Handling 
if (document.URL == "https://account.aq.com/AQW/Inventory") {
	// page load 
	document.addEventListener('DOMContentLoaded', function(event) {
		
	// Wait function for table load 
	waitForTableToLoad()
	
	})
	
	
	
// Wiki Page Handling 
} else {
	// Adds theme if enabled 
	chrome.storage.local.get({darkmode: 0}, function(result){
		if(result.darkmode) {
			addCss(chrome.runtime.getURL("themes/dark.css"));
		}
	});
	
	// page load 
	document.addEventListener('DOMContentLoaded', function(event) {
	

	// Get title of Wiki page (Name of category basically) 
	const Title = document.getElementById("page-title")
	
	// Creates Found amount element near title. 
	var found_info = document.createElement("a") 
	found_info.innerHTML = "- Found 0 Items"
	found_info.style = "font-weight: bold;color:green;"
	Title.appendChild(found_info)
	
	
	
	var styles = `
    #UpdateInventory:hover {
		filter: contrast(120%) brightness(1.25);; 
	}`
	var styleSheet = document.createElement("style")
	styleSheet.innerText = styles
	document.head.appendChild(styleSheet)
	
	var update_inventory = document.createElement("button") 
	update_inventory.onclick = function() { processAcountBackground(); return false; }
	update_inventory.style = "background-color: Transparent;border: none;" 
	update_inventory.innerHTML = " <img id='UpdateInventory' style='height:35px;' src="+inventory_update_icon+"></img>"
	Title.appendChild(update_inventory)

	
	// Selects all <a> elements 
	// [It is best method, as it is compatible with other browsers]
	var nodeList = document.querySelectorAll("a")
	
	// How much <a> elements to skip 
	const arrayOffset = 190
	
	let arrayList = Array.from(nodeList).slice(arrayOffset) // About 200 is alright
	
	// Site detect vars 
	
	try{
		var isMonster = document.body.parentElement.innerHTML.includes("Difficulty");
	} 
	catch(err){var isMonster = false}
	try{
		var isShop =    document.body.parentElement.innerHTML.includes("(Shop)");
	} 
	catch(err){var isShop = false}
	

	// if shop is a merge shop 
	try{
		var isMerge = document.body.parentElement.innerHTML.includes('class="yui-nav"'); 
	} 
	catch(err){var isMerge = false}
	
	
	// Item lists 
	try{
		var isList = document.body.parentElement.innerHTML.includes("Go to"); 
	} 
	catch(err){var isList = false}
	
	
	
	
	
	// get stored data
	// If WIP in options is enabled.
	chrome.storage.local.get({wipmoreinfo: 1}, function(result){WIP_moreinfo = result.wipmoreinfo;})

	// Get account data (Just not items) 
	chrome.storage.local.get({aqwbuy: []}, function(result){Buy = result.aqwbuy;});
	chrome.storage.local.get({aqwcategory: []}, function(result){Category = result.aqwcategory;});
	chrome.storage.local.get({aqwwhere: []}, function(result){Where = result.aqwwhere;});
	chrome.storage.local.get({aqwtype: []}, function(result){Type = result.aqwtype;});
	
	
	// Get items and process it 
	chrome.storage.local.get({aqwitems: []}, function(result){
			var Items = result.aqwitems;
			
	
			alert(isMerge)
			// Iterate over nodelist with array offset applied 
			for (var x = 0; x < arrayList.length; x++) {
				
				ProcessWikiItem(nodeList, arrayOffset, Items, Buy, Category, Where, Type, x, isMerge, isList) 
				
				
				// Wip process (Can be enabled in options of Extension.
				if (WIP_moreinfo) {
					if (!isMonster && !isShop) {
						ProcessAnyWikiItem(nodeList, arrayOffset, Buy, Category, Where, Type, x)
					}
				}
			}
			// Displays found amount 
			found_info.innerHTML = "- Found "+found+" Items" // Displays items found 
			
	})
	})
}
