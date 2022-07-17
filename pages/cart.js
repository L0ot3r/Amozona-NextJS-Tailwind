import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Dynamic from 'next/dynamic';

import Layout from '../components/Layout/Layout';
import { XCircleIcon } from '@heroicons/react/outline';

import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../constants/actionTypes';
import { Store } from '../utils/Store';

const CartSCreen = () => {
	const router = useRouter();
	const { state, dispatch } = useContext(Store);
	const {
		cart: { cartItems },
	} = state;

	const removeItemHandler = (item) => {
		dispatch({ type: CART_REMOVE_ITEM, payload: item });
	};

	const updateCartHandler = (item, qty) => {
		const quantity = Number(qty);
		dispatch({ type: CART_ADD_ITEM, payload: { ...item, quantity } });
	};

	return (
		<Layout title='Shopping Cart'>
			<h1 className='mb-4 text-xl'>Votre panier</h1>
			{cartItems.length === 0 ? (
				<div>
					<p className='mb-3'>Votre panier est vide.</p>
					<button type='button' className='primary-button'>
						<Link href='/'>Revenir à la boutique</Link>
					</button>
				</div>
			) : (
				<div className='grid md:grid-cols-4 md:gap-5'>
					<div className='overflow-x-auto md:col-span-3'>
						<table className='min-w-full card-shopping'>
							<thead className='border-b'>
								<tr>
									<th className='px-5 text-left'>Item</th>
									<th className='p-5 text-right flex justify-center'>
										Quantity
									</th>
									<th className='p-5 text-right'>Price</th>
									<th className='p-5'>Action</th>
								</tr>
							</thead>
							<tbody>
								{cartItems.map((item) => (
									<tr
										key={item.name.toLowerCase().replace(/ /g, '-')}
										className='card-shopping'
									>
										<td>
											<Link
												href={`/product/${item.productType}/${item.name
													.toLowerCase()
													.replace(/ /g, '-')}`}
											>
												<a className='flex items-center ml-2'>
													<Image
														src={item.image}
														alt={item.name}
														width={50}
														height={50}
													/>{' '}
													&nbsp;
													{item.name}
												</a>
											</Link>
										</td>
										<td className='p-5 text-right flex justify-center'>
											<select
												className='select-box'
												value={item.quantity}
												onChange={(e) =>
													updateCartHandler(item, e.target.value)
												}
											>
												{[...Array(item.countInStock).keys()].map((x) => (
													<option value={x + 1} key={x + 1}>
														{x + 1}
													</option>
												))}
											</select>
										</td>
										<td className='p-5 text-right'>$ {item.price}</td>
										<td className='p-5 text-center'>
											<button onClick={() => removeItemHandler(item)}>
												<XCircleIcon className='h-8 w-8 fill-red-500 stroke-white' />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div>
						<div className='card p-5'>
							<ul>
								<li>
									<div className='pb-3 text-xl font-bold'>
										Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) :
										$ {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
									</div>
								</li>
								<li>
									<button
										className='primary-button w-full'
										onClick={() => router.push('login?redirect=/shipping')}
									>
										Checkout
									</button>
								</li>
							</ul>
						</div>
					</div>
				</div>
			)}
		</Layout>
	);
};

export default Dynamic(() => Promise.resolve(CartSCreen), { ssr: false });
