// CLEANING OF THE REQUEST

// Store the request data in a variable
var request_data = request.content.asJSON;
var errorState = false;
var reviewData = {};
var reviewDataResponse = {};


// Print log message on GET request
if(request.method === 'GET')
{
	print("Client Obtaining data from the database... Safe action..."); 
}

// Print log message on POST request
if(request.method === 'POST')
{
 	print("Warning!!! Client attempting to change database data!!!"); 
}

// Print log message on DELETE request
if(request.method === 'DELETE')
{     
	print("WARNING!!! DATA BEING REMOVED!!! CONTACT ADMIN BEFORE PERFOMING SUCH OPTIONS!!!");     
}

// Test to see if the request is a POST. If so, then 
if(request.method === 'POST') 
{
  	// Store each of the fields from the request so that you cna 
  	var title = 	request_data.title;
    var year = 		request_data.year;
  	var actors = 	request_data.actors;
  
  
  if(!title) {
    	// Test to see if request had a title
   		 // If not print message to XML file
        context.setVariable("hasError", "true");
    	context.setVariable("errorMessage", "Missing title in request. Please enter a title and retry.");
        errorState = true;
      
  } else if (!year) 
  {
        // Missing the year message
        context.setVariable("hasError", "true"); 
        context.setVariable("errorMessage", "Missing year in request. Please enter a year and retry.");
        errorState = true;
		
        
  } else if(!actors) 
  {
        // Missing Actor Data error Message
        context.setVariable("hasError", "true");   
        context.setVariable("errorMessage", "Missing actors in request. Please enter a actor and retry.");
        errorState = true;

  } else 
  {
        // Declare new object to replace the request with the cleaned data
        var tmp = {};
    
        // Set the different parameters in the object to make sure that it only has the 3 necessary fields
        tmp.title = title;
        tmp.year = year;
        tmp.actors = actors;
        
        // Overrite teh request with teh new content
        request.content = JSON.stringify(tmp);
  }
}


 if (request.queryParams.review == "true")
 {
      reviewData = httpClient.get('http://onibakuman-test.apigee.net/v1/hw4/reviews');
   	  reviewData.waitForComplete();
   	  reviewDataResponse = reviewData.getResponse().content.asJSON;
 }


// SENDING OF THE RESPONSE


// Set the response to the current content what it contains
var response_data = response.content.asJSON;


// Prepare the response with the approprate fields. Take all the entities and loop through them all to a cleaned version of them (without all the extra fluff)
if(response_data.action==="get" && errorState == false) 
{
  	
  	// Store the entities in the currently generated response and store them in a variable
  	var entity_data = response_data.entities;
//  	var review_data = httpGet("http://onibakuman-test.apigee.net/v1/hw4/reviews/");
  	
  	// Iterate through all of the entities and only save the releavent data to send in the response
  	for(var i in entity_data) 
    {
    	var tmp_obj = {};
      
      	// Set the appropriate fields to the values needed
    	tmp_obj["title"] = entity_data[i]["title"];
    	tmp_obj["year"] = entity_data[i]["year"];
    	tmp_obj["actors"] = entity_data[i]["actors"];
      	tmp_obj["movieTitle"] = entity_data[i]["movieTitle"];
     	tmp_obj["reviewContent"] = entity_data[i]["reviewContent"]; 
        tmp_obj["reviewerName"] = entity_data[i]["reviewerName"];  
        tmp_obj["reviewerQuote"] = entity_data[i]["reviewerQuote"];
      	
		// Append the review data as field in the response
         if (request.queryParams.review == "true")
         {      for(var j in reviewDataResponse) {
           			if(entity_data[i]["title"] == reviewDataResponse[j]["movieTitle"]) {
                    	tmp_obj["reviewData"] = reviewDataResponse[j];
                    } 
                }                                                  
         }
      
      	// Note this is here simply to help you refer to different movies
      	tmp_obj["uuid"] = entity_data[i]["uuid"];
    
    	entity_data[i] = tmp_obj;
  }
  
  	response.content = JSON.stringify(entity_data);
//  	response.content = review_data;

}
if(errorState == true) {
  response.content = "{\"error\" : Error! Check your request!}";  
}

