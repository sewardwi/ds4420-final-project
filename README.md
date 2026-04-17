e# Kalshi Prediction Market Efficiency

This project investigates whether Kalshi prediction market prices have predictive power over contract resolution outcomes, and whether past price dynamics contain exploitable structure beyond the current market price. We applied three machine learning methods, Bayesian Logistic Regression, ARIMA, and an LSTM. Each probing market efficiency from a different angle.

Do Kalshi prediction market prices fully aggregate available information, or do other signals retain predictive power beyond the market price itself?

## Data

- **Source:** [Jon Becker's prediction market dataset](https://github.com/Jon-Becker/prediction-market-analysis) 

- **Sample:** 347 finalized binary markets, 106,955 individual trades

- **Filtering:** Finalized status, binary yes/no resolution, minimum volume threshold, excluded multivariate parlay contracts

- **Features per trade:** ticker, yes_price (0-1), count, taker_side, created_time, outcome

## Models

- **Bayesian Logistic Regression:** manually implemented in Python using NumPy, uses Metropolis Hastings MCMC to produce a posterior distribution over feature weights, quantifying which contract level signals retain predictive power beyond the market price alone.

- **ARIMA:** implemented in R, fits one model per contract to test whether each price series behaves as a random walk, with Ljung Box residual diagnostics determining whether past prices carry predictive information about future prices.

- **LSTM:** implemented in PyTorch, trains on 12 hour sliding windows of hourly prices with a dual regression and classification objective, testing whether nonlinear temporal structure in price sequences can outperform a random walk on next price prediction and the market price baseline on resolution prediction.
