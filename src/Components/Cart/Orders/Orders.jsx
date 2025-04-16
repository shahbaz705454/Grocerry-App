import { useEffect, useState } from 'react';
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
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '@clerk/clerk-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const allOrders = handleSessionStorage('get', 'orders') || [];
        // Filter orders for the current user
        const userOrders = allOrders.filter(order => order.userId === user?.id);
        setOrders(userOrders);
    }, [user]);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Your Orders
            </Typography>
            {orders.length === 0 ? (
                <Card sx={{ mt: 2, p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No orders found
                    </Typography>
                    <Typography color="text.secondary">
                        Looks like you haven't placed any orders yet.
                    </Typography>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {orders.map((order) => (
                        // ...existing code for order items...
                        <Grid item xs={12} key={order.orderId}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Order #{order.orderId}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Ordered on: {new Date(order.orderDate).toLocaleDateString()}
                                    </Typography>
                                    <Chip 
                                        label={order.status.toUpperCase()} 
                                        color={order.status === 'pending' ? 'warning' : 'success'}
                                        sx={{ mt: 1 }}
                                    />
                                    <Accordion sx={{ mt: 2 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography>Order Details</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {order.items.map((item, index) => (
                                                <Typography key={index}>
                                                    {item.name} x {item.quantity} - ${item.subtotal}
                                                </Typography>
                                            ))}
                                            <Box sx={{ mt: 2 }}>
                                                <Typography>Subtotal: ${order.payment.subtotal}</Typography>
                                                <Typography>Tax: ${order.payment.tax}</Typography>
                                                <Typography>Shipping: ${order.payment.shipping}</Typography>
                                                <Typography variant="h6">
                                                    Total: ${order.payment.total}
                                                </Typography>
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Orders;