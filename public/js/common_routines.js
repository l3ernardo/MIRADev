/**************************************************************************************************
 * Draft idea for validation fields for MIRA Web
 * Developed by: Artur Bernardo Queiroz
 * Date: 10th January 2017
 *
 */

//Field validation for assessment hollistic documents.
function CheckAuditReviewLocalFields() {  
	if ($("#reportDate").val() == "") { 
			alert("Report Date is Require");
			$('#reportDate').focus();
			return false;
	} else { 
		if  ($("#rating").val() == "") {
			alert("Rating is Require");
			$('#rating').focus();
			return false;
		} else {
			if(!$.isNumeric($("#numRecommendationsTotal").val())) {
				alert("Total Recomemendation must be numeric type.");
				$('#numRecommendationsTotal').focus();
				return false;
			} else {
				if(!$.isNumeric($("#numRecommendationsOpen").val())) {
					alert("Open Recomemendation must be numeric type.");
					$('#numRecommendationsOpen').focus();
					return false;
				}
			}	
		}
	}
	return true;
}

