import logo from './logo.svg';
import './App.css';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'
import React, { useMemo, useState, useEffect } from 'react';
import { useTable } from 'react-table'
import styled from "styled-components";
import Dashboard from "./component/modal";

function Table({ columns, data }) {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable({
      columns,
      data,
    })
  
    return (
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

const App = () => {
  const [packages_data, setpackages_data] = useState([]);

   // GET with fetch API
   useEffect(() => {
    const fetchPost_package = async () => {
       try {
          const response = await fetch(
            'http://192.168.142.128:8081/package'
          );
          const packages = await response.json();
          console.log(packages);
          setpackages_data(packages);
        } catch (error) {
          console.log(error);
      }       
    };
    fetchPost_package();
  }, []);

  const fetchPost_package = async () => {
    try {
       const response = await fetch(
         'http://192.168.142.128:8081/package'
       );
       const packages = await response.json();
       console.log(packages);
       setpackages_data(packages);
     } catch (error) {
       console.log(error);
   }       
 };

  const packages_columns = useMemo(
    () => [
      {
        Header: 'package id',
        accessor: 'id'
      },
      {
        Header: 'flight',
        accessor: 'flight'
      },
      {
        Header: 'stay',
        accessor: 'stay'
      },
      {
        Header: 'price',
        accessor: 'price'
      },
      {
        Header: 'quota',
        accessor: 'quota'
      }
    ],
    []
  )

  const [order_data, setorder_data] = useState([]);

   // GET with fetch API
   useEffect(() => {
    const fetchPost_order = async () => {
       try {
          const response = await fetch(
            'http://192.168.142.128:8081/order/accc9630-6d57-4d6e-a6d7-f1abce45789e/orma.chang@msa.hinet.net'
          );
          const order = await response.json();
          console.log(order);
          setorder_data(order);
        } catch (error) {
          console.log(error);
      }       
    };
    fetchPost_order();
  }, []);

  function clickMe() {
    alert("You clicked me!");
    console.log("You clicked me!");
  }  
  
  const [order_detail, setOrderDetail] = useState('');
  const [purchase, setPurchase] = useState({});
  const [order, setOrder] = useState({});

  const handlePurchaseChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setPurchase(values => ({...values, [name]: value}))
  }

  const handlePurchaseSubmit = (event) => {
    event.preventDefault();
    console.log(purchase);
    addPackage(purchase.id, purchase.email);
  }  


  // Post with fetchAPI
   const addPackage = async (package_id, purchase_email) => {
    try {
        let response = await fetch('http://192.168.142.128:8081/order', {
            method: 'POST',
            body: JSON.stringify({
                id: package_id,
                email: purchase_email,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        let data = await response.json();
        console.log(data);
        if (data.message == null) {
            setOrderDetail(data);
            fetchPost_package();
        } else {
            alert(data.message);
            console.log(data.message);
        }
    } catch (error) {
        alert(error);
        console.log(error);
    }   
  };

//    // Post with fetchAPI
//    const queryOrder = async (order_id, order_email) => {
//     let response = await fetch('http://192.168.142.128:8081/order', {
//        method: 'POST',
//        body: JSON.stringify({
//           id: order_id,
//           email: order_email,
//        }),
//        headers: {
//           'Content-type': 'application/json; charset=UTF-8',
//        },
//     });
//     let data = await response.json();
//     setOrderDetail((order_detail) => [data, ...order_detail]);
//   };

  const queryOrder = async (order_id, order_email) => {
    try {
       const response = await fetch(
         'http://192.168.142.128:8081/order/'+order_id+'/'+order_email
       );
       const order = await response.json();
       if (order.message == null) {
        console.log(order);
        setorder_data(order);
       } else {
        alert(order.message);
        console.log(order.message);
       }
     } catch (error) {
       console.log(error);
       alert(error);
    }       
 };


  const handleOrderChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setOrder(values => ({...values, [name]: value}))
  }

  const handleOrderSubmit = (event) => {
    event.preventDefault();
    console.log(order);
    queryOrder(order.id, order.email);
  }  
    
  return (
    <div className="App">
      <h1>Hilbert's Grand Hotel</h1>      
      <h1>select pacakges and place an order with an email</h1>
      <Table columns={packages_columns} data={packages_data}></Table>
      <form onSubmit={handlePurchaseSubmit}>
        <label>Enter package id:
        <input 
          type="number" 
          name="id" 
          value={purchase.id || ""} 
          onChange={handlePurchaseChange}
        />
        </label>
        <label>Enter purchase email:
          <input 
            type="text" 
            name="email" 
            value={purchase.email || ""} 
            onChange={handlePurchaseChange}
          />
        </label>
        <input type="submit" />
        <Dashboard />        
      </form>
      <div className="order-id" key={order_detail._id}>
        <h2 className="order-id">purchase order detail result</h2>
        <h2 className="order-id">{order_detail.id}</h2>
        <p className="order-email">{order_detail.email}</p>
        <p className="order-flight">{order_detail.flight}</p>
        <p className="order-stay">{order_detail.stay}</p>
        <p className="order-price">{order_detail.price}</p>
        <p className="order-createdDate">{order_detail.createdDate}</p>
      </div>
      <h1>order by order ID with the email used when purchase the order</h1>
      <form onSubmit={handleOrderSubmit}>
        <label>Enter order id:
        <input 
            type="text" 
            name="id" 
            value={order.id || ""} 
            onChange={handleOrderChange}
        />
        </label>
        <label>Enter purchase email:
        <input 
            type="text" 
            name="email" 
            value={order.email || ""} 
            onChange={handleOrderChange}
        />
        </label>
        <input type="submit" />
      </form>
      <div className="order-id" key={order_data._id}>
        <h2 className="order-id">{order_data.id}</h2>
        <p className="order-email">{order_data.email}</p>
        <p className="order-flight">{order_data.flight}</p>
        <p className="order-stay">{order_data.stay}</p>
        <p className="order-price">{order_data.price}</p>
        <p className="order-createdDate">{order_data.createdDate}</p>
      </div>
    </div>
  )
}
// const App = () => {
//   const [title, setTitle] = useState('');
//   const [body, setBody] = useState('');
//   const [posts, setPosts] = useState([]);

//    // GET with fetch API
//    useEffect(() => {
//     const fetchPost = async () => {
//        try {
//           const response = await fetch(
//             // 'https://jsonplaceholder.typicode.com/posts?_limit=10'
//             'http://192.168.142.128:8081/package'
//           );
//           const packages = await response.json();
//           console.log(packages);
//           setPosts(packages);
//         } catch (error) {
//           console.log(error);
//       }       
//     };
//     fetchPost();
//   }, []);

//    // Delete with fetchAPI
//    const deletePost = async (id) => {
//     let response = await fetch(
//        `https://jsonplaceholder.typicode.com/posts/${id}`,
//        {
//           method: 'DELETE',
//        }
//     );
//     if (response.status === 200) {
//        setPosts(
//           posts.filter((post) => {
//              return post.id !== id;
//           })
//        );
//     } else {
//        return;
//     }
//   };

//    // Post with fetchAPI
//    const addPosts = async (title, body) => {
//     let response = await fetch('https://jsonplaceholder.typicode.com/posts', {
//        method: 'POST',
//        body: JSON.stringify({
//           title: title,
//           body: body,
//           userId: Math.random().toString(36).slice(2),
//        }),
//        headers: {
//           'Content-type': 'application/json; charset=UTF-8',
//        },
//     });
//     let data = await response.json();
//     setPosts((posts) => [data, ...posts]);
//     setTitle('');
//     setBody('');
//   };

//  const handleSubmit = (e) => {
//     e.preventDefault();
//     addPosts(title, body);
//   };

// return (
//   <div className="posts-container">
//   {posts.map((post) => {
//      return (
//         <div className="post-card" key={post.id}>
//            <h2 className="post-flight">{post.flight}</h2>
//            <p className="post-stay">{post.stay}</p>
//            <p className="post-price">{post.price}</p>
//            <p className="post-quota">{post.quota}</p>
//            <CButton color="primary">Delete</CButton>    
//            {/* <div className="button">
//             <div className="delete-btn">Delete</div>
//            </div> */}
//         </div>
//      );
//   })}
// </div>
// );
// };


export default App;
