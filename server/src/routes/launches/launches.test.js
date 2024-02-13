const request = require('supertest');
const app = require('../../app');
const {mongoConnect, mongoDisconnect} = require('../../services/mongo');

describe('Launches API', () => {
    beforeAll( async () => {
       await mongoConnect();
    });

    afterAll( async () => {
        await mongoDisconnect();
     });

    describe('Test GET /launches', () => {
        test('it should respond with 200 status', async () => {
            const respond = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);
            
        });
    });
    
    describe('Test POST /launch', ()=> {
        const completeLaunchData ={
            mission:"ISRO Aditya-L1 Misson",
            rocket:"Aditya-L1",
            target:"Kepler-62 f",
            launchDate:"January 9, 2066"
        };
        const LaunchDatawithoutDate ={
            mission:"ISRO Aditya-L1 Misson",
            rocket:"Aditya-L1",
            target:"Kepler-62 f",
        };
    
        const LaunchDatawithInvalidDate ={
            mission:"ISRO Aditya-L1 Misson",
            rocket:"Aditya-L1",
            target:"Kepler-62 f",
            launchDate:"ztff"
        }
        test('it should respond with 201 success',async () => {
            const respond = request(app)
            .post('/v1/launches')
            .send(completeLaunchData).expect('Content-Type', /json/)
            .expect(201);
            const launchparsedate = new Date(completeLaunchData.launchDate);
            expect((await respond).body).toMatchObject({
                mission:"ISRO Aditya-L1 Misson",
                rocket:"Aditya-L1",
                target:"Kepler-62 f",
                launchDate: launchparsedate.toISOString()
            });
        });
    
        test('it should catch missing required properties', async()=> {
            
            const respond = request(app)
            .post('/v1/launches')
            .send(LaunchDatawithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
            expect((await respond).body).toStrictEqual({
                "error":"Values are missing"
            })
        });
    
        test('it should catch invalid date formate', async()=>{
            const respond = request(app)
            .post('/v1/launches')
            .send(LaunchDatawithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
            expect((await respond).body).toStrictEqual({
                "error":"unknown format"
            })
        });
    });
});
