/**************************************************************************************************
 * 
 * Business Unit code for MIRA Web
 * Developed by : Gabriel Fuentes
 * Date: 25 May 2016
 * 
 */

var q  = require("q");

var businessunit = {
	/* Display Business Units */
	listBU: function(req, db) {
		var deferred = q.defer();
		var bunits = [];
		var obj = {
			selector:{
				"_id": {"$gt":0},
				"keyName": "BusinessUnit"
			}
		};
		try{
			db.find(obj).then(function(data){
				var doc = data.body.docs[0].value;
				for (i=0; i<doc.length; i++){
					if(doc[i].option == "enable"){
						bunits.push({name : doc[i].businessUnit});
					}
				}
				deferred.resolve({"status": 200, "bunits": bunits});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	/* Save parameter in session */
	saveBU: function(req, db) {
		var deferred = q.defer();
		try{
			var value = req.body.selectedBU;
			var obj = {
				selector:{
					"_id": {"$gt":0},
					"keyName": "MIRAVersion"
				}
			};
			db.find(obj).then(function(data){
				var doc = data.body.docs[0];
				deferred.resolve({"status": 200, "bunit": value, "version": doc.value.title + " " + doc.value.version});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	getMenu: function(req,db) {
		var deferred = q.defer();
		try{
			var bunit = req.session.businessunit;
			var obj = {
				selector : {
					"_id": {"$gt":0},
					keyName: "MIRAMenu" //MIRAMenu
				}};
			var groups = req.session.user.groupName;
			db.find(obj).then(function(data){
				var doc = data.body.docs[0].value;
				var submenu = [];
				doc.forEach(function(bu) { 
					if (bu.businessUnit==bunit){
						submenu = bu;
						//console.log('Menu Title:' + bu.menutitle);
						var menuEntryIndex = 0;
						bu.menu.forEach(function(menuEntry) {
							var subEntryIndex = 0;
							var invalidEntry = 0;
							menuEntry.entries.forEach(function(subEntry) {
								if(submenu.menu[menuEntryIndex].entries[subEntryIndex]) {
									//console.log("Checking entry: " + submenu.menu[menuEntryIndex].entries[subEntryIndex].name);
								}
								var flag = false;
								subEntry.role.forEach(function(rl) {
									if(groups.indexOf(rl)!=-1 && !flag) {
										flag = true;
										//console.log("Role authorized: " + rl);
									}
								})
								if(!flag) {
									invalidEntry++;
									if(submenu.menu[menuEntryIndex].entries[subEntryIndex]) {
										//console.log("Deleting entry: " + submenu.menu[menuEntryIndex].entries[subEntryIndex].name);
										delete submenu.menu[menuEntryIndex].entries[subEntryIndex];
									}
								}
								subEntryIndex++;
							})
							if(invalidEntry==subEntryIndex) {
								if(submenu.menu[menuEntryIndex]) {
									//console.log("Deleting menu: " + submenu.menu[menuEntryIndex].title);
									delete submenu.menu[menuEntryIndex];
								}
							}
							menuEntryIndex++;
						});
					}
				});
				deferred.resolve({"status": 200,"submenu":submenu})	
			}).catch(function(err){
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	}
};
module.exports = businessunit;
