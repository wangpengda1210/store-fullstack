import {ProductStore} from "../../models/product";

describe('Test the product model', () => {
    const store = new ProductStore();

    let productId: Number;
    describe('Test the create method', () => {
        it('should return correct product name, category and price', async function () {
            const result = await store.create({
                id: 0,
                name: "coke",
                price: 2,
                category: 'drink',
                description: 'Good to drink'
            });

            expect(result.price).toEqual(2);
            expect(result.name).toEqual('coke');
            expect(result.category).toEqual('drink');
            productId = result.id;
        });
    });

    describe('Test the index method', () => {
        it('should return all products including the added one', async function () {
            const result = await store.index();

            expect(result).toContain({
                id: productId,
                name: 'coke',
                price: 2,
                category: 'drink',
                description: 'Good to drink'
            });
        });
    });

    describe('Test the show method', () => {
        it('should return the product with correct information', async function () {
            const result = await store.show(String(productId));

            expect(result).toEqual({
                id: productId,
                name: 'coke',
                price: 2,
                category: 'drink',
                description: 'Good to drink'
            });
        });
    });

    describe('Test the getByCategory method', () => {
        beforeAll(async () => {
            await store.create({
                id: 0,
                name: "pepsi",
                price: 2,
                category: 'drink',
                description: 'Good to drink'
            });

            await store.create({
                id: 0,
                name: "sprite",
                price: 2,
                category: 'drink',
                description: 'Good to drink'
            });
        });

        it('should return list of all products with the category', async function () {
            const result = await store.getByCategory('drink');

            expect(result.length).toEqual(3);
            expect(result[0].name).toEqual('coke');
            expect(result[1].name).toEqual('pepsi');
            expect(result[2].name).toEqual('sprite');
        });
    });
});