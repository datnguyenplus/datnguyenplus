/**
* @swagger
* /api/v1/login:
*   post:
*     tags:
*       - FE_Authenticate
*     summary: Auth Login
*     description: User Login
*     produces:
*       - application/json
*     parameters:
*       - name: info
*         description: User object
*         in:  body
*         required: true
*         type: string
*         schema:
*           example : {
*              email : 'nguyentandat43@gmail.com',
*               password : '123456',
*               order_details :[
*               {
*                 a : '1',
*                 b: '2'
*               },
*               {
*                 a : '1',
*                 b: '2'
*               }
*             ]
*           }
*     responses:
*       200:
*         description: User Login
*/