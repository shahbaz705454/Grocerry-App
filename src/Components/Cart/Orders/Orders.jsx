import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import { handleSessionStorage } from '../../../utils/utils';
import { 
    Box, 
    Typography, 
    Card, 
    CardContent, 
    Grid, 
    Chip, 
    Accordion, 
    AccordionSummary, 
    AccordionDetails,
    Button 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '@clerk/clerk-react';

const Orders = () => {
    // ...existing state and useEffect...

    const sendOrderEmail = (order) => {
        const itemsList = order.items
            .map(item => `${item.name} x ${item.quantity} - $${item.subtotal}`)
            .join('\n');

        const templateParams = {
            to_email: 'owner@example.com', // Replace with owner's email
            from_name: order.customerInfo.fullName,
            customer_email: order.customerInfo.email,
            order_id: order.orderId,
            order_date: new Date(order.orderDate).toLocaleDateString(),
            items_list: itemsList,
            subtotal: order.payment.subtotal,
            tax: order.payment.tax,
            shipping: order.payment.shipping,
            total: order.payment.total,
            shipping_address: order.customerInfo.address,
            order_status: order.status
        };

        emailjs.send(
            'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
            'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
            templateParams,
            'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
        )
        .then((result) => {
            console.log('Email sent successfully:', result.text);
            alert('Order details sent to owner!');
        })
        .catch((error) => {
            console.error('Failed to send email:', error);
            alert('Failed to send order details');
        });
    };

    // Add this inside your map function where orders are rendered
    return (
        <Box sx={{ p: 4 }}>
            {/* ...existing code... */}
            <Grid container spacing={3}>
                {orders.map((order) => (
                    <Grid item xs={12} key={order.orderId}>
                        <Card>
                            <CardContent>
                                {/* ...existing order details... */}
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Shipping Address: {order.customerInfo.address}
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        size="small"
                                        onClick={() => sendOrderEmail(order)}
                                    >
                                        Send to Owner
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};