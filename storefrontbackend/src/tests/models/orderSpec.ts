import {OrderStore} from "../../models/order";
import {UserStore} from "../../models/user";
import {ProductStore} from "../../models/product";

describe('Test the order model', () => {
    const orderStore = new OrderStore();
    const productStore = new ProductStore();
    const userStore = new UserStore();

    let userId: Number;
    let productId1: Number;
    let productId2: Number;
    beforeAll(async () => {
        const result = await userStore.login("test_first_name",
            "test_last_name", "secret");

        userId = result!.id;

        const newProduct1 = await productStore.create({
            id: 0,
            name: "coke",
            price: 2,
            category: 'drink',
            description: 'Good to drink'
        });
        productId1 = newProduct1.id;

        const newProduct2 = await productStore.create({
            id: 0,
            name: "pepsi",
            price: 2,
            category: 'drink',
            description: 'Good to drink'
        });
        productId2 = newProduct2.id;
    });

    let orderId: Number;
    describe('Test the addProduct method', () => {
        it('should return correct product id and quantity', async function () {
            const result = await orderStore.addProduct(userId, productId1, 1);

            expect(result.product_id).toEqual(productId1);
            expect(result.quantity).toEqual(1);
            orderId = result.order_id;
        });
    });

    describe('Test the showActiveOrder method', () => {
        it('should return correct user id and products in it', async function () {
            const result = await orderStore.showActiveOrder(userId);

            expect(result.id).toEqual(orderId);
            expect(result.user_id).toEqual(userId);
            expect(result.products.length).toEqual(1);
            expect(result.products[0].product_id).toEqual(productId1);
            expect(result.products[0].quantity).toEqual(1);
        });
    });

    describe('Test the completeOrder method', () => {
        beforeAll(async () => {
            await orderStore.addProduct(userId, productId2, 2);
        })

        it('should return correct order id with status "complete"',
            async function () {
            const result = await orderStore.completeOrder(userId);

            expect(result.id).toEqual(orderId);
            expect(result.user_id).toEqual(userId);
            expect(result.status).toEqual('complete');
        });
    });

    describe('Test the showCompletedOrders methods', () => {
        it('should return correct completed orders', async function () {
            const result = await orderStore.showCompletedOrders(userId);

            expect(result.length).toEqual(1);
            const order = result[0];
            expect(order.id).toEqual(orderId);
            expect(order.user_id).toEqual(userId);
            expect(order.products.length).toEqual(2);
            expect(order.products[0].product_id).toEqual(productId1);
            expect(order.products[1].product_id).toEqual(productId2);
        });
    })
});