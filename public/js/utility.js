function fnReport(element, table, typefile, filename){
	var data = encodeURIComponent(table);
	var result = "";
	if(typefile == "xls"){
		result = "data:application/vnd.ms-excel," + data;
		filename = filename + ".xls";
	}
	else{
		result = "data:application/vnd.oasis.opendocument.spreadsheet," + data;
		filename = filename + ".ods";
	}
	element.attr("href", result);
	element.attr("download", filename);
	element.attr("target", "_blank");
	return true;
}