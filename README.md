# Second-Talent-test-full-stack-developer-
test-full-stack-developer for Second Talent

Frontend/Backend 路徑說明

Frontend /hello-world

Backend  /my-server

### Frontend

Please implement the following features in frontend

- a page to place select pacakges and place an order with an email
  - 已完成, 簡單透過網頁輸入框輸入 package id, email 即可以訂購
  - 1.需透過 POST http://localhost:8081/flight 預訂機票(Backend - an endpoint to reserve flight)
    -       Content-Type:application/json
    -       { 
              "ticket": "Flight-2", 
              "mail": "orma.chang@msa.hinet.net"
            }
  - 2.需透過 POST http://localhost:8081/room 預訂房間(Backend - an endpoint to reserve a hotel room)
    -       Content-Type:application/json
    -       { 
              "ticket": "Flight-7", 
              "stay": "2022-08-09", 
              "email": "orma.chang@msa.hinet.net"
            }
  - 3.完成 機票/房間 預訂, 即可透過網頁輸入框輸入 package id, email 進行訂購
    - 會檢查 預訂的機票/房間 是否符合 package, 確認無誤完成 package 訂購
  
- a result page that shows the order with details, or simply a fail message
  - 已完成, package 訂購成功會直接顯示訂單明細於網頁, 有錯誤會發出 alter message dialog
  
- a page to show an order by order ID with the email used when purchase the order
  - 已完成, 簡單透過網頁輸入框輸入 order id, email 即可以查詢, 正確於網頁顯示訂單明細, 有錯誤會發出 alter message dialog

### Backend

Please implement the following features in backend


- an endpoint to reserve flight
  - Please fail 50% of the reservation randomly
    - 已完成, 請參考 POST http://localhost:8081/flight
      
- an endpoint to reserve a hotel room
  - a valid flight ticket number MUST be provided in order to make the reservation
    - 已完成, 請參考 POST http://localhost:8081/room
      - 合法機票, 目前以package中有列出的 Flight-# 視為合法機票
        
- an endpoint to purchase a package
  - only allow to purchase package with quota > 0, if quota runs out, throw an exception
  - consume 1 quota before reserving flight and hotel room as to avoid oversale
  - release the quota (add back 1) once either flight or hotel room reservation fail
    - 已完成, 請參考 POST http://localhost:8081/order (id 為 package id, email 為訂購者 email)
    -               Content-Type:application/json
    -               { 
                      "id": "2", 
                      "mail": "orma.chang@msa.hinet.net"
                    }    

- an endpoint to retrieve the order by ID and email
  - 已完成, 請參考 GET http://localhost:8081/order/:id/:email (id 為 訂單 id, email 為訂購者 email)

### Design and explanations

Please briefly explain why/how did you choose the tech stack, e.g. Docker, ReactJS/Vue.js, ant-design/Material UI/CoreUI, database, web framework, ORM/ODM, etc
- frontend
  - 使用 ReactJS, 實作時間有限並未使用 ant-design/Material UI/CoreU 等進行頁面優化
- database
  - 使用 mongoDB 搭配 Mongoose/ODM 進行資料庫操作  
- backend
  - 使用 Node.js 搭配 express web framework 進行 restfull API 實作
  - 完整測試API可參考 /my-server/test.rest
- 本次實作時間很緊湊, 選用的 tech stack 主要以本身近期較熟悉, 及儘量以第一次提問相關的技術當作實務選擇,
  主要在有限時間內完成交付任務的主要功能完整度為本次實作目標,
  時間有限fronend僅用最簡單方式與後端功能串接,
  實際源碼的重構及優化還有恨大空間,   




  

