import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import { Layout } from '../../components';
import { data } from '../../constants';
import { Store } from '../../utils/Store';
import { CART_ADD_ITEMS } from '../../constants/actionTypes';

export default function ProductDetails() {
	const { state, dispatch } = useContext(Store);
	const { query } = useRouter();
	const { slug } = query;
	const product = data.products.laptop.find(
		(x) => x.name.toLowerCase().replace(/ /g, '-') === slug
	);

	if (!product) return <div>Product Not Found</div>;

	const addToCartHandler = () => {
		const existItem = state.cart.cartItems.find(
			(x) =>
				x.name.toLowerCase().replace(/ /g, '-') ===
				product.name.toLowerCase().replace(/ /g, '-')
		);
		const quantity = existItem ? existItem.quantity + 1 : 1

		if(product.countInStock < quantity){
			alert('Sorry. Product out of stock !')
			return;
		}
		dispatch({ type: CART_ADD_ITEMS, payload: { ...product, quantity } });
	};


	return (
		<Layout title={product.name}>
			<div className='py-2'>
				<Link href='/'>Back to Products</Link>
			</div>
			<div className='grid md:grid-cols-4 md:gap-3'>
				<div className='md:col-span-2'>
					<Image
						src={product.image}
						alt={product.name}
						width={640}
						height={640}
						layout='responsive'
						className='rounded-lg'
					/>
				</div>

				<div>
					<ul>
						<li className='text-lg font-bold'>{product.name}</li>
						<li>{product.category}</li>
						<li>{product.brand}</li>
						<li>
							{product.rating} of {product.numReviews} reviews
						</li>
						<li>
							Description: <br /> {product.description}
						</li>
					</ul>
				</div>

				<div>
					<div className='card p-5'>
						<div className='mb-2 flex justify-between'>
							<div>Price</div>
							<div>${product.price}</div>
						</div>
						<div className='mb-2 flex justify-between'>
							<div>Status</div>
							<div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
						</div>
						<button
							className='primary-button w-full'
							onClick={addToCartHandler}
						>
							Add to cart
						</button>
					</div>
				</div>
			</div>
		</Layout>
	);
}
