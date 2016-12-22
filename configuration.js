var fs = require('fs');

var configuration = {
	siteTitle: "MIRA",
	conTitle: 'MSAC Integrated Reporting Application',
	siteDesc: 'The MSAC Web Tool',
	keyNameM: 'MIRAMenu',
	keyNameBU: 'BusinessUnit',
	keyIntCal: 'calendaridall',
	msgIdPassR: 'IBM Intranet ID and/or password is required',
	msgIdPassW: 'Wrong IBM Intranet ID and/or password.',
	facesURLcn: 'https://faces.tap.ibm.com/api/find/?q=%t',
	facesURLmail: 'https://faces.tap.ibm.com/api/find/?q=%t',
	bpURL: 'https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmperson/(%f=%t).search/byjson',
	bpOrgURL: 'https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmorganization/hrOrganizationCode=%t.search/byjson',
	bpDivURL: 'https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmdivdept/dept=%t.search/byjson',
	bgURL: 'https://bluepages.ibm.com/tools/groups/groupsxml.wss?task=listMembers&attrib=%f&group=%t',
	addMembersURL: 'https://bluepages.ibm.com/tools/groups/protect/groups.wss?gName=%g&task=Members&mebox=%u&Select=Add+Members&API=1',
	delMembersURL: 'https://bluepages.ibm.com/tools/groups/protect/groups.wss?gName=%g&task=DelMem&mebox=%u&Delete=Delete+Checked&API=1 ',
	mirainterfaces: 'https://mira-connector-dev.w3ibm.mybluemix.net',
	maxElementsPerView : 1000,	
	start: function() {
		var data = (fs.readFileSync('manifest.info', 'utf8'));
		var lines = data.split(/\r?\n/);
		for(var i=0;i<lines.length;i++) {
			if(lines[i].indexOf('name')!=-1) {
				org =(lines[i].split(":")[1]).trim();
			}
		}	
		console.log("Environment: " + org)		
		if(org=="mira-dev") {
			/* Due to connection issues with test bluepages/bluegroups and bluemix, temporarily use the production */
			//this.bpURL = 'https://tstbluepages.mkm.can.ibm.com/BpHttpApisv3/slaphapi?ibmperson/(%f=%t).search/byjson';
			//this.bpOrgURL = 'https://tstbluepages.mkm.can.ibm.com/BpHttpApisv3/slaphapi?ibmorganization/hrOrganizationCode=%t.search/byjson';
			//this.bpDivURL = 'https://tstbluepages.mkm.can.ibm.com/BpHttpApisv3/slaphapi?ibmdivdept/dept=%t.search/byjson';
			//this.bgURL = 'https://tstbluepages.mkm.can.ibm.com/tools/groups/groupsxml.wss?task=listMembers&attrib=%f&group=%t';
			//this.addMembersURL = 'https://tstbluepages.mkm.can.ibm.com/tools/groups/protect/groups.wss?gName=%g&task=Members&mebox=%u&Select=Add+Members&API=1';
			//this.delMembersURL = 'https://tstbluepages.mkm.can.ibm.com/tools/groups/protect/groups.wss?gName=%g&task=DelMem&mebox=%u&Delete=Delete+Checked&API=1';

			this.bpURL = 'https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmperson/(%f=%t).search/byjson';
			this.bpOrgURL = 'https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmorganization/hrOrganizationCode=%t.search/byjson';
			this.bpDivURL = 'https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmdivdept/dept=%t.search/byjson';
			this.bgURL = 'https://bluepages.ibm.com/tools/groups/groupsxml.wss?task=listMembers&attrib=%f&group=%t';
			this.addMembersURL = 'https://bluepages.ibm.com/tools/groups/protect/groups.wss?gName=%g&task=Members&mebox=%u&Select=Add+Members&API=1';
			this.delMembersURL = 'https://bluepages.ibm.com/tools/groups/protect/groups.wss?gName=%g&task=DelMem&mebox=%u&Delete=Delete+Checked&API=1';
			
			this.mirainterfaces = 'https://mira-connector-dev.w3ibm.mybluemix.net';
		}
		if(org=="mira-test") {
			/* Due to connection issues with test bluepages/bluegroups and bluemix, temporarily use the production */
			//this.bpURL = 'https://tstbluepages.mkm.can.ibm.com/BpHttpApisv3/slaphapi?ibmperson/(%f=%t).search/byjson';
			//this.bpOrgURL = 'https://tstbluepages.mkm.can.ibm.com/BpHttpApisv3/slaphapi?ibmorganization/hrOrganizationCode=%t.search/byjson';
			//this.bpDivURL = 'https://tstbluepages.mkm.can.ibm.com/BpHttpApisv3/slaphapi?ibmdivdept/dept=%t.search/byjson';
			//this.bgURL = 'https://tstbluepages.mkm.can.ibm.com/tools/groups/groupsxml.wss?task=listMembers&attrib=%f&group=%t';
			//this.addMembersURL = 'https://tstbluepages.mkm.can.ibm.com/tools/groups/protect/groups.wss?gName=%g&task=Members&mebox=%u&Select=Add+Members&API=1';
			//this.delMembersURL = 'https://tstbluepages.mkm.can.ibm.com/tools/groups/protect/groups.wss?gName=%g&task=DelMem&mebox=%u&Delete=Delete+Checked&API=1';

			this.bpURL = 'https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmperson/(%f=%t).search/byjson';
			this.bpOrgURL = 'https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmorganization/hrOrganizationCode=%t.search/byjson';
			this.bpDivURL = 'https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmdivdept/dept=%t.search/byjson';
			this.bgURL = 'https://bluepages.ibm.com/tools/groups/groupsxml.wss?task=listMembers&attrib=%f&group=%t';
			this.addMembersURL = 'https://bluepages.ibm.com/tools/groups/protect/groups.wss?gName=%g&task=Members&mebox=%u&Select=Add+Members&API=1';
			this.delMembersURL = 'https://bluepages.ibm.com/tools/groups/protect/groups.wss?gName=%g&task=DelMem&mebox=%u&Delete=Delete+Checked&API=1';
			
			this.mirainterfaces = 'https://mira-connector-test.w3ibm.mybluemix.net';
		}		
		if(org=="mira") {
			this.bpURL = 'https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmperson/(%f=%t).search/byjson';
			this.bpOrgURL = 'https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmorganization/hrOrganizationCode=%t.search/byjson';
			this.bpDivURL = 'https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmdivdept/dept=%t.search/byjson';
			this.bgURL = 'https://bluepages.ibm.com/tools/groups/groupsxml.wss?task=listMembers&attrib=%f&group=%t';
			this.addMembersURL = 'https://bluepages.ibm.com/tools/groups/protect/groups.wss?gName=%g&task=Members&mebox=%u&Select=Add+Members&API=1';
			this.delMembersURL = 'https://bluepages.ibm.com/tools/groups/protect/groups.wss?gName=%g&task=DelMem&mebox=%u&Delete=Delete+Checked&API=1';
			this.mirainterfaces = 'https://mira-connector.w3ibm.mybluemix.net';
		}	
	},
}

module.exports = configuration;
