import {UserStore} from "../../models/user";

describe('Test the user model', () => {
    const store = new UserStore();

    describe('Test the create method', () => {
        it('should return object with correct user first name and last name', async function () {
            const result = await store.create({
                id: 0,
                first_name: "test_first_name",
                last_name: "test_last_name",
                password: "secret"
            });

            expect(result.first_name).toEqual("test_first_name");
            expect(result.last_name).toEqual("test_last_name");
        });

        it('should throw error when trying to add user with same first and last name', async function () {
            await expectAsync(store.create({
                id: 0,
                first_name: "test_first_name",
                last_name: "test_last_name",
                password: "secret"
            })).toBeRejected();
        });
    });

    let userId: Number;
    describe('Test the login method', () => {
        it('should return object with correct first name and last name when login success',
            async function () {
            const result = await store.login("test_first_name",
                "test_last_name", "secret");

            expect(result).not.toBeNull();
            expect(result!.first_name).toEqual("test_first_name");
            expect(result!.last_name).toEqual("test_last_name");
            userId = result!.id;
        });

        it('should return null with incorrect first name',
            async function () {
                const result = await store.login("i_forgot_it",
                    "test_last_name", "secret");

                expect(result).toBeNull();
            });

        it('should return null with incorrect password',
            async function () {
                const result = await store.login("test_first_name",
                    "test_last_name", "this_should_be_the_password");

                expect(result).toBeNull();
            });
    });

    describe('Test the index method', () => {
        it('should return a list with the created user included', async function () {
            const result = await store.index();
            expect(result).toContain({
                id: userId,
                first_name: "test_first_name",
                last_name: "test_last_name"
            });
        });
    });

    describe('Test the show method', () => {
        it('should return object with correct id, first name and last name', async function () {
            const result = await store.show(String(userId));
            expect(result).toEqual({
                id: userId,
                first_name: "test_first_name",
                last_name: "test_last_name"
            });
        });
    });
});