package com.yucircle.marketplaceapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yucircle.marketplaceapp.model.Notification;
import com.yucircle.marketplaceapp.model.Product;
import com.yucircle.marketplaceapp.model.Rating;
import com.yucircle.marketplaceapp.repository.NotificationRepository;
import com.yucircle.marketplaceapp.repository.ProductRepository;

@Service
public class NotificationProducerService {
	
	@Autowired
	private NotificationRepository nRepo;
	
	@Autowired
	private ProductRepository pRepo;

	public void createRatingNotification(Rating rating) {
		
		Notification n = new Notification();
		
		Product product = pRepo.findById(rating.getProductId()).get();
		
		String message = rating.getUsername() + " rated your product "; 
		message += "\"" + product.getProductName() + "\" ";
		message += rating.getRating() + " stars!";
		
		n.setUsername(product.getUsername());
		n.setMessage(message);
		
		nRepo.save(n);
	}
}
