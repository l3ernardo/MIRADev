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
		var obj = {
			selector:{
				"_id": {"$gt":0},
				"keyName": "BusinessUnit"
			}
		};
		db.find(obj).then(function(data){
			var doc = data.body.docs;
			deferred.resolve({"status": 200, "doc": doc});
		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},
	/* Save parameter in session */
	saveBU: function(req, db) {
		var deferred = q.defer();
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
			deferred.reject({"status": 500, "error": err});
		});	
		return deferred.promise;		
	},
	getMenu: function(req,db) {
		var deferred = q.defer();
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
		}).catch(function(error){
			console.log(error);
			deferred.reject({"status": 500, "error": error});
		});
		return deferred.promise;
	}
};
module.exports = businessunit;
