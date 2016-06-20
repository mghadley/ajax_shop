$(document).ready( function() {
	baseUrl = "http://devpoint-ajax-example-server.herokuapp.com/api/v1/products"

	function addProduct(product) {
		var description = product.description ? product.description : 'None provided :/'
		var card = '<div class="col s6 m3">';
				card += '<div class="card light-green lighten-4" data-id="' + product.id + '">';
				card += '<div class="card-content">';
				card += '<span class="card-title">' + product.name + '</span>';
				card += '<p>Description: ' + description + '</p>';
				card += '</div></div></div></div>'
				card += 
		$('#products').append(card);
	};

	function showProduct(id) {
		$.ajax({
			url: baseUrl + '/' + id,
			type: 'GET',
			dataType: 'JSON'
		}).done( function(data) {
			var description = data.product.description ? data.product.description : 'None provided :/'
			var weight = data.product.weight ? data.product.weight : 'Unknown';
			var price = data.product.base_price ? data.product.base_price : 0;
			$('#show_name').text(data.product.name);
			$('#show_description').text(description);
			$('#show_price').text('$' + price);
			$('#show_quantity').text(data.product.quanity_on_hand);
			$('#show_weight').text(weight);
			if(data.product.other_attributes) {
				var attributes = 'Other Attribtes <p>' + data.product.other_attributes + '</p>'
			}
			$('#show_buttons').remove();
			var buttons = '<div id="show_buttons" data-id="' + data.product.id + '"><button class="btn update-btn">Update</button>'
					buttons += '<button class="btn delete-btn">Delete</buttion>'
					buttons += '<button class="btn buy-btn" data-quant="' + data.product.quanity_on_hand + '">Purchase</buttion></div>'
			$('#show').append(buttons);
		});
		$('#index').hide();
		$('#new').hide();
		$('#update').hide();
		$('#show').show();
	};

	$('#new_form').on('submit', function(e) {
		var form = $(this);
		e.preventDefault();
		data = $(this).serializeArray()
		data[data.length - 1].value === '' && data.splice((data.length - 1), 1);
		debugger
		var data = $(this).serializeArray();
		$.ajax({
			url: baseUrl,
			type: 'POST',
			dataType: 'JSON',
			data: data
		}).done( function(){
			form[0].reset();
			$('#new').hide();
			indexProducts();
			$('#index').show();
		})
	});

	$(document).on('keyup', '#inputs input:last-child', function(e) {
		if(e.which !== 9){
			otherInput = "<input class='other_attr to_remove' placeholder='Other Attribute' name='product[other_attributes][]'>"
			$('#inputs').append(otherInput);
		}
	})

	$(document).on('click', '.buy-btn', function() {
		var id = $(this).closest('div').data().id;
		var newQuant = $(this).data().quant - 1;
		$.ajax({
			url: baseUrl + '/' + id,
			type: 'PUT',
			dataType: 'JSON',
			data: {product: {"quanity_on_hand": newQuant}}
		}).done( function() {
			alert('You bought it good job');
			indexProducts();
			$('#show').hide()
			$('#index').show()
		})
	})

	$(document).on('click', '.card', function() {
		var id = $(this).data().id;
		showProduct(id);
	});

	$(document).on('click', '.delete-btn', function() {
		var id = $(this).closest('div').data().id;
		$.ajax({
			url: baseUrl + '/' + id,
			type: 'DELETE',
			dataType: 'JSON'
		}).done( function() {
			indexProducts();
			$('#show').hide()
			$('#index').show()
		})
	})

	$(document).on('click', '.update-btn', function() {
		var id = $(this).closest('div').data().id;
		$.ajax({
			url: baseUrl + '/' + id,
			type: 'GET',
			dataType: 'JSON',
		}).done( function(data) {
			$('#show').hide();
			$('#update').show();
			$('#update_name').val(data.product.name);
			$('#update_description').val(data.product.description);
			$('#update_price').val(data.product.base_price);
			$('#update_quantity').val(data.product.quanity_on_hand);
			$('#update_weight').val(data.product.weight)
			$('#update_other').val(data.product.other_attributes);
		});
		$('#update_form').on('submit', function(e) {
		e.preventDefault();
		$.ajax({
			url: baseUrl + '/' + id,
			type: 'PUT',
			dataType: 'JSON',
			data: $('#update_form').serializeArray()
		}).done( function() {
			showProduct(id);
		})
	})
	});

	

	$('#index_link').click( function() {
		$('#show').hide();
		$('#new').hide();
		$('#update').hide();
		$('#index').show();
		indexProducts();
	})

	$('#new_link').click( function() {
		$('#show').hide();
		$('#index').hide();
		$('#new').show();
	});

	const indexProducts = () => {
		$.ajax({
			url: baseUrl,
			type: 'GET',
			dataType: 'JSON'
		}).done( function(data) {
			$('#products').children().remove()
			data.products.forEach( function(product) {
				if(product.quanity_on_hand > 0) {
					addProduct(product); 
				};
			});
		});
	};

	indexProducts();
})






