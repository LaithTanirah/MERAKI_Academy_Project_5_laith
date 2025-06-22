"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBListGroup,
  MDBListGroupItem,
  MDBRipple,
  MDBRow,
  MDBTooltip,
  MDBTypography,
} from "mdb-react-ui-kit";

// Types
interface CartItem {
  id: number;
  quantity: number;
}

interface CartProduct {
  id: number;
  title: string;
  color: string;
  size: string;
  price: number;
  image?: string;
}

interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export default function PaymentMethods() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartProducts, setCartProducts] = useState<Record<number, CartProduct>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Decode token to get userId
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        const parsedUserId = Number(decoded.userId);
        setUserId(!isNaN(parsedUserId) ? parsedUserId : 8);
      } catch (err) {
        console.error("Invalid token:", err);
        setUserId(8); // fallback
      }
    } else {
      setUserId(8); // fallback
    }
  }, [token]);

  // Fetch cart items
  useEffect(() => {
    if (userId === null) return;
    const fetchCart = async () => {
      try {
        const response = await axios.get<{ cart: CartItem[] }>(
          `http://localhost:5000/api/cart/getAllCartByIsDeletedFalse/${userId}`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );
        setCartItems(response.data.cart);
        console.log(response.data.cart);
        
      } catch (err) {
        setError(axios.isAxiosError(err) ? err.message : "Error fetching cart.");
      }
    };
    fetchCart();
  }, [userId, token]);

  // Fetch product details for each cart item
  useEffect(() => {
    if (cartItems.length === 0) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const productEntries = await Promise.all(
          cartItems.map(async (item) => {
            const res = await axios.get<CartProduct>(
              `http://localhost:5000/api/cartProduct/${item.id}`,
              {
                headers: { authorization: `Bearer ${token}` },
              }
            );
            return [item.id, res.data] as [number, CartProduct];
          })
        );
        setCartProducts(Object.fromEntries(productEntries));
      } catch (err) {
        setError(axios.isAxiosError(err) ? err.message : "Error fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cartItems, token]);

  // Cart actions
  const increaseQuantity = (id: number) =>
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

  const decreaseQuantity = (id: number) =>
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

  const changeQuantity = (id: number, value: string) => {
    const qty = Math.max(0, Number(value));
    if (isNaN(qty)) return;
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const removeItem = (id: number) =>
    setCartItems((items) => items.filter((item) => item.id !== id));

  const totalPrice = cartItems.reduce((sum, item) => {
    const product = cartProducts[item.id];
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  if (loading) {
    return (
      <MDBContainer className="py-5 text-center">
        <MDBTypography tag="h5">Loading cart...</MDBTypography>
      </MDBContainer>
    );
  }

  if (error) {
    return (
      <MDBContainer className="py-5 text-center">
        <MDBTypography tag="h5" className="text-danger">
          {error}
        </MDBTypography>
      </MDBContainer>
    );
  }

  if (cartItems.length === 0) {
    return (
      <MDBContainer className="py-5 text-center">
        <MDBTypography tag="h5">Your cart is empty.</MDBTypography>
      </MDBContainer>
    );
  }

  return (
    <section className="h-100 gradient-custom">
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center my-4">
          <MDBCol md="8">
            <MDBCard className="mb-4">
              <MDBCardHeader>
                <MDBTypography tag="h5">
                  Cart - {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </MDBTypography>
              </MDBCardHeader>
              <MDBCardBody>
                {cartItems.map((item) => {
                  const product = cartProducts[item.id];
                  if (!product) return null;

                  return (
                    <MDBRow key={item.id} className="mb-4">
                      <MDBCol lg="3" md="12" className="mb-4 mb-lg-0">
                        <MDBRipple rippleColor="light">
                          <img
                            src={product.image ?? "https://via.placeholder.com/150"}
                            className="w-100"
                            alt={product.title}
                          />
                        </MDBRipple>
                      </MDBCol>

                      <MDBCol lg="5" md="6">
                        <p><strong>{product.title}</strong></p>
                        <p>Color: {product.color}</p>
                        <p>Size: {product.size}</p>
                        <MDBTooltip title="Remove item">
                          <MDBIcon
                            fas
                            icon="trash"
                            role="button"
                            onClick={() => removeItem(item.id)}
                          />
                        </MDBTooltip>
                      </MDBCol>

                      <MDBCol lg="4" md="6">
                        <div className="d-flex mb-4" style={{ maxWidth: "300px" }}>
                          <MDBBtn className="px-3 me-2" onClick={() => decreaseQuantity(item.id)}>
                            <MDBIcon fas icon="minus" />
                          </MDBBtn>

                          <MDBInput
                            value={item.quantity}
                            type="number"
                            label="Qty"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              changeQuantity(item.id, e.target.value)
                            }
                            style={{ width: "60px" }}
                          />

                          <MDBBtn className="px-3 ms-2" onClick={() => increaseQuantity(item.id)}>
                            <MDBIcon fas icon="plus" />
                          </MDBBtn>
                        </div>

                        <p className="text-start text-md-center">
                          <strong>${(product.price * item.quantity).toFixed(2)}</strong>
                        </p>
                      </MDBCol>
                    </MDBRow>
                  );
                })}
                <hr />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="4">
            <MDBCard className="mb-4">
              <MDBCardHeader>
                <MDBTypography tag="h5">Summary</MDBTypography>
              </MDBCardHeader>
              <MDBCardBody>
                <MDBListGroup flush>
                  <MDBListGroupItem className="d-flex justify-content-between">
                    Products <span>${totalPrice.toFixed(2)}</span>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between">
                    Shipping <span>Gratis</span>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between">
                    <div><strong>Total amount</strong></div>
                    <span><strong>${totalPrice.toFixed(2)}</strong></span>
                  </MDBListGroupItem>
                </MDBListGroup>
                <MDBBtn block size="lg">Go to checkout</MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
