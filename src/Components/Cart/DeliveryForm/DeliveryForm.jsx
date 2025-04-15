import { Button, Fade, TextField } from '@mui/material';
import { useForm } from "react-hook-form";
import { groceryContext } from '../../Layout/Layout';
import { useContext, useState } from 'react';
import GoBackButton from '../GoBackButton/GoBackButton';
import { handleSessionStorage } from '../../../utils/utils';
import PopUpDialog from '../../PopUpDialog/PopUpDialog';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const DeliveryForm = () => {
    const { cartItemsState } = useContext(groceryContext);
    const [cartItems, setCartItems] = cartItemsState;
    const [openDialog, setOpenDialog] = useState(false);
    const { user } = useAuth();
    
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    // Calculate order summary
    const calculateOrderSummary = () => {
        const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1; // 10% tax
        const shipping = 5.99; // Fixed shipping cost
        const total = subtotal + tax + shipping;

        return {
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            shipping: shipping.toFixed(2),
            total: total.toFixed(2)
        };
    };

    // Generate unique order ID
    const generateOrderId = () => {
        return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    };

    // Handle PlaceOrder
    const onSubmit = (data) => {
        const orderSummary = calculateOrderSummary();
        const orderId = generateOrderId();

        // Create detailed order object
        const orderDetails = {
            orderId: orderId,
            userId: user?.id,
            orderDate: new Date().toISOString(),
            customerInfo: {
                fullName: data.full_name,
                email: data.email,
                address: data.address
            },
            items: cartItems.map(item => ({
                productId: item.id,
                name: item.name,
                price: parseFloat(item.price),
                quantity: item.quantity,
                subtotal: parseFloat((item.price * item.quantity).toFixed(2)),
                image: item.image || '',
                category: item.category || ''
            })),
            payment: {
                subtotal: parseFloat(orderSummary.subtotal),
                tax: parseFloat(orderSummary.tax),
                shipping: parseFloat(orderSummary.shipping),
                total: parseFloat(orderSummary.total)
            },
            status: 'pending',
            tracking: {
                status: 'processing',
                updatedAt: new Date().toISOString(),
                estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
            }
        };

        // Store order in session storage
        const existingOrders = handleSessionStorage('get', 'orders') || [];
        handleSessionStorage('set', 'orders', [...existingOrders, orderDetails]);

        // Store delivery details
        handleSessionStorage('set', 'deliveryDetails', data);
        
        // Log order details
        console.log('New Order Created:', orderDetails);

        // Show success dialog
        setOpenDialog(true);
    };

    // Handle Dialog Close
    const handleOK = () => {
        // Reset the Cart items
        handleSessionStorage('remove', 'cartItems');
        setCartItems([]);
        setOpenDialog(false);
        navigate('/orders'); // Navigate to orders page instead of home
    };

    return (
        <>
            <PopUpDialog
                open={openDialog}
                message={'Order Placed successfully! Redirecting to orders page...'}
                handleOk={handleOK}
                placeOrder={true} />
            <div className='md:mx-0 mx-auto space-y-4 max-w-[37rem]'>
                <GoBackButton />
                <div className='space-y-9 lg:space-y-10'>
                    <h1 className='lg:text-2xl text-xl font-semibold text-gray-600'>
                        Complete Delivery Details
                    </h1>

                    <Fade in={true}>
                        <form action="post"
                            className='lg:space-y-8 space-y-7'
                            onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                {...register('full_name', {
                                    required: 'Name is required',
                                })}
                                defaultValue={user?.fullName || ''}
                                label='Full Name'
                                size='small'
                                error={errors.full_name ? true : false}
                                helperText={errors.full_name ? errors.full_name.message : ''}
                                fullWidth
                                color='success'
                                variant='outlined' />

                            <TextField
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
                                label='Email'
                                size='small'
                                error={errors.email ? true : false}
                                helperText={errors.email ? errors.email.message : ''}
                                fullWidth
                                color='success'
                                variant='outlined' />

                            <TextField
                                {...register('address', {
                                    required: 'Address is required',
                                })}
                                label='Address'
                                size='small'
                                error={errors.address ? true : false}
                                helperText={errors.address ? errors.address.message : ''}
                                fullWidth
                                placeholder='street, city, state'
                                color='success'
                                variant='outlined' />

                            <div className='p-4 bg-gray-50 rounded-md'>
                                <h2 className='font-semibold mb-3'>Order Summary</h2>
                                {cartItems.map((item, index) => (
                                    <div key={index} className='flex justify-between mb-2'>
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <hr className='my-2' />
                                <div className='space-y-1'>
                                    {Object.entries(calculateOrderSummary()).map(([key, value]) => (
                                        <div key={key} className='flex justify-between'>
                                            <span className='capitalize'>{key}</span>
                                            <span>${value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button 
                                type='submit'
                                fullWidth
                                variant='contained'
                                sx={{ textTransform: 'capitalize' }}
                                color='success'>
                                Place Order
                            </Button>
                        </form>
                    </Fade>
                </div>
            </div>
        </>
    );
};

export default DeliveryForm;