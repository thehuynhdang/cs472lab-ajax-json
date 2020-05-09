 "use strict";

$(document).ready(function() {
	 $("#searchBookForm").css('display', 'none');
	 $("#bodyContent").load("homepage.html #homepage");
	 
	 $("a.nav-link").each(function() {
		 $(this).click(function() {
			 const li = $(this).parent();
			 li.addClass('active').siblings().removeClass('active');
			 
			 const link = $(this).text();
			 if(link == 'Home') {
				 $("#bodyContent").load("homepage.html #homepage");
				 $("#searchBookForm").css('display', 'none');
			 } else if(link == 'Books') {
				 $("#searchBookForm").css('display', '');
				 
				 $("#bodyContent").load("books-list.html #books-list", function() {
					 loadBooks();

					 $("#btnAddNewBook").click(function() {
						 clearFormFields();
						 $("#modalBookFormAlertMessageBox").css("display", 'none');
					 });
					 
					 $("#bookForm").submit(function(event) {
						 event.preventDefault();
						 
						 const isbn = $("#isbn").val();
					     const title = $("#title").val();
					     const overdueFee = parseFloat($("#overdueFee").val());
					     const publisher = $("#publisher").val();
					     const datePublished = $("#datePublished").val();
					     
						 const data = {
								 isbn: isbn,
								 title:title,
								 overdueFee:overdueFee,
								 publisher:publisher,
								 datePublished:datePublished
						 };
						 
						 console.log(JSON.stringify(data));
						 
//						 $.post("https://elibraryrestapi.herokuapp.com/elibrary/api/book/add", data)
//						  .done(response => {
//							  console.log("Added successfully.");
//							  $("#modalBookFormAlertMessageBox").css("display", '');
//						  }).fail(err => console.log("Error: " + err));
						 
						 fetch("https://elibraryrestapi.herokuapp.com/elibrary/api/book/add", {
					         method: "post",
					         body: JSON.stringify(data),
					         headers: {
					             "Content-Type": "application/json"
					         }
					     }).then(function(response) {
					         return response.json();
					     }).then(function (jsonResponseData) {
					         console.log(jsonResponseData);  
					         loadBooks();
					         
					         $("#modalBookFormStrongAlertText").text("Book successfully added!");
					         $("#modalBookFormAlertMessageBox").removeClass("alert-danger");
					         $("#modalBookFormAlertMessageBox").addClass("alert-success");
					         $("#modalBookFormAlertMessageBox").css("display", '');
					         
							 clearFormFields()
					 	    
					     }).catch(function(error) {
					         console.error(error);
					         $("#modalBookFormAlertMessageBox").removeClass("alert-success");
					         $("#modalBookFormAlertMessageBox").addClass("alert-danger");
					         $("#modalBookFormAlertMessageBox").css("display", '');
					     });
						 
					 });
					 
					 $("#searchBookForm").submit(function() {
						 event.preventDefault();
						 
						 const queryString = $('#queryString').val();
						 $('#tbodyBooks tr').each(function() {
							 const cols = $(this).children('td');
							 
							 const isbn = $(cols[0]).text();
							 const title = $(cols[1]).text();
							 const publisher = $(cols[3]).text();
							 console.log('publisher ' + publisher);
							 let found = isbn.search(queryString)!=-1 || title.search(queryString)!=-1 || publisher.search(queryString)!=-1;
							 if(!found) {
								 $(this).css('display', 'none');
							 } else {
								 $(this).css('display', '');
							 }
						 });
					 });
				 });
			 }
		 });
	 });
	 
	 function clearFormFields() {
         $("#isbn").val("");     
 	     $("#title").val("");   
 	     $("#overdueFee").val("0.00");
 	     $("#publisher").val("");
 	     $("#datePublished").val(""); 
     }
	 
	 function loadBooks() {
		 $('#tbodyBooks').html('<tr><td colspan="6"><img alt="loading" src="images/ajax-loader.gif">&nbsp;Loading...</td></tr>');
		 $.get("https://elibraryrestapi.herokuapp.com/elibrary/api/book/list")
		  .done(response => {
			  if(response.length > 0) {
				  const table = $('#tbodyBooks');
				  table.html('');
				  
				  response.forEach(function(item, index) {
					  const trow = `<tr><th scope="row">${item.bookId}.</th><td>${item.isbn}</td><td>${item.title}</td><td>$${item.overdueFee}</td><td>${item.publisher}</td><td>${item.datePublished}</td></tr>`;
					  table.append(trow);
				  });
			  } else {
				  table.append('<tr><td colspan="6">No record</td></tr>');
			  }
		  })
		  .fail(response => {
			  console.log('Error: ' + response);
			  $('#tbodyBooks').html('Loading Error.');
		  });
	 }
});