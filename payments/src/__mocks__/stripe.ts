export const stripe ={
    charges:{
        create: jest.fn().mockReturnValue({id: '12345'})
    }
}