import useRequest from '../../hooks/use-request'
import StripeCheckout from 'react-stripe-checkout'
import Router from 'next/router'

import { useEffect, useState } from 'react'

const OrderShow = ({currentUser, order}) =>{
    const [timeLeft, setTimeLeft] = useState(0)
    const {doRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body:{
            orderId: order.id
        },
        onSuccess: (payment) => Router.push('/orders')
    })

    useEffect(()=>{
        const findTimeLeft = ()=>{
            const msLeft = new Date(order.expiresAt) - new Date()
            setTimeLeft(Math.Round(msLeft / 1000))
        }

        findTimeLeft()

        const timerId = setInterval(findTimeLeft, 1000)

        return () => {
            clearInterval(timerId)
        }
    }, [])

    if (timeLeft < 0) {
        return <div>Order Expired</div>
    }

    return (
    <div>
        <div>Time left to pay: {timeLeft} </div>
        <StripeCheckout 
            token={({ id })=> doRequest({ token: id })}
            stripeKey={"pk_test_51JhOaBKvZ6TXo8BTMSITF0exXQmGPjdUraLfaIJAeYweXi1WTsu6sNh2vWJ1hfNbpoGROfwGE2Y5k2TgVjMFSrYY006PAOw0ZF"}
            amount={order.ticket.price * 100}
            email={currentUser.email}
        />
           {errors}
    </div>
    )
}

OrderShow.getInitialProps = async (context, client)=>{
    const {orderId} = context.query
    const {data} = await client.get(`/api/orders/${orderId}`)

    return {order: data}
}

export default OrderShow