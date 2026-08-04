const path = require('path');
const fs = require('fs');
const os = require('os');
const request = require('supertest');
const moment = require('moment');
const { createApp } = require('../app');

describe('Personal Efficiency Dashboard API', () => {
  let app;
  let dataFile;

  beforeEach(() => {
    dataFile = path.join(
      os.tmpdir(),
      `ped-test-${Date.now()}-${Math.random().toString(16).slice(2)}.json`
    );
    app = createApp({ dataFile });
  });

  afterEach(() => {
    if (fs.existsSync(dataFile)) {
      fs.unlinkSync(dataFile);
    }
  });

  test('seeds gym, study, and work activities', async () => {
    const res = await request(app).get('/api/activities');
    expect(res.status).toBe(200);
    const names = res.body.map((a) => a.name).sort();
    expect(names).toEqual(['Gym', 'Study', 'Work']);
  });

  test('clocks in and out a session', async () => {
    const clockIn = await request(app)
      .post('/api/sessions/clock-in')
      .send({ activity_type: 'Gym', notes: 'Leg day' });

    expect(clockIn.status).toBe(200);
    expect(clockIn.body.activity_type).toBe('Gym');

    const active = await request(app).get('/api/sessions/active');
    expect(active.body.id).toBe(clockIn.body.id);

    const clockOut = await request(app)
      .post('/api/sessions/clock-out')
      .send({ session_id: clockIn.body.id });

    expect(clockOut.status).toBe(200);
    expect(clockOut.body.message).toMatch(/Clocked out/i);
  });

  test.each([
    ['week', 7],
    ['month', 30],
    ['year', 365]
  ])('analytics aggregates a %s (%i-day) window', async (period, days) => {
    const expectedStart = moment().subtract(days, 'days').format('YYYY-MM-DD');
    const res = await request(app).get(`/api/analytics?period=${period}`);

    expect(res.status).toBe(200);
    expect(res.body.period).toBe(period);
    expect(res.body.start_date).toBe(expectedStart);
    expect(res.body).toHaveProperty('total_sessions');
    expect(res.body).toHaveProperty('daily_data');
  });
});
