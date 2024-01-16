import InstrumentsService from "../../../lib/services/instruments-service"
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client"
import SessionService from "../../../lib/services/session-service"
import _ from 'lodash'

const client = new TastytradeHttpClient(process.env.BASE_URL!)
const instrumentsService = new InstrumentsService(client)

beforeEach(async () => {
  const sessionService = new SessionService(client)
  await sessionService.login(process.env.TEST_API_USERNAME!, process.env.TEST_API_PASSWORD!)
});

describe('getCryptocurrencies', () => {
  it('responds with the correct data', async function() {
    const response = await instrumentsService.getCryptocurrencies()
    expect(response).toHaveProperty('name');
expect(response).toHaveProperty('symbol');
  })
})

describe('getSingleCryptocurrency', () => {
  it('responds with the correct data', async function() {
    const cryptocurrencySymbol = 'BTC/USD'
    const response = await instrumentsService.getSingleCryptocurrency(cryptocurrencySymbol)
    expect(response.symbol).toBe(cryptocurrencySymbol)
  })
})

describe('getSingleEquity', () => {
  it('responds with the correct data', async function() {
    const equitySymbol = 'AAPL'
    const response = await instrumentsService.getSingleEquity(equitySymbol)
    expect(response).toHaveProperty('name');
expect(response).toHaveProperty('symbol');
expect(response).toHaveProperty('description');
    expect(response.symbol).toBe(equitySymbol)
  })
})

describe('getFutureOptionsProducts', () => {
    it('responds with the correct data', async function() {
      const response = await instrumentsService.getFutureOptionsProducts()
      expect(response.length).toBeGreaterThan(0);
      expect(response).toBeDefined();
    })
})

describe('getSingleFutureOptionProduct', () => {
  it('responds with the correct data', async function() {
    const response = await instrumentsService.getSingleFutureOptionProduct('CME', 'ES')
    expect(response).toHaveProperty('name');
expect(response).toHaveProperty('symbol');
expect(response).toHaveProperty('description');
  })
})

describe('getFuturesProducts', () => {
    it('responds with the correct data', async function() {
      const response = await instrumentsService.getFuturesProducts()
      expect(response.length).toBeGreaterThan(0)
    })
})

describe('getSingleFutureProduct', () => {
  it('responds with the correct data', async function() {
    const response = await instrumentsService.getSingleFutureProduct('CME', 'ES')
    expect(response.exchange).toBe('CME')
    expect(response.code).toBe('ES')
  })
})

describe('getQuantityDecimalPrecisions', () => {
    it('responds with the correct data', async function() {
      const response = await instrumentsService.getQuantityDecimalPrecisions()
      expect(response.length).toBeGreaterThanOrEqual(0);
      const btcPrecision = _.filter(response, item => item.symbol === 'BTC/USD')
      expect(_.isNil(btcPrecision)).toBeFalsy()
    })
})

describe('getNestedOptionChain', () => {
  it('responds with the correct data', async function() {
    const response = await instrumentsService.getNestedOptionChain('AAPL')
    expect(response.length).toBeGreaterThan(0);

    // Fetch a single option
    const optionChain = _.first(response) as any
    const optionExpiration = _.first(optionChain.expirations) as any
    const optionStrike = _.first(optionExpiration.strikes) as any
    const equityOption = await instrumentsService.getSingleEquityOption(optionStrike.call)
    expect(equityOption.symbol).toBe(optionStrike.call)
  })
})
