import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number, 
  price_def: number, 
  ratio: number, 
  timestamp: Date, 
  upper_bound: number, 
  lower_bound: number, 
  trigger_alert: number | undefined
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) : Row{
    const delta = 0.05;

    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const ratioUpperBound = 1 + delta;
    const ratioLowerBound = 1 - delta;


    return {
      price_abc: priceABC, 
      price_def: priceDEF, 
      ratio, 
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ? 
                serverResponds[0].timestamp : serverResponds[1].timestamp, 
                //return the last timestamp (timestamp of the latest dp to be generated)
      upper_bound: ratioUpperBound, 
      lower_bound: ratioLowerBound, 
      trigger_alert: (ratio > ratioUpperBound || ratio < ratioLowerBound) ? ratio : undefined, 
    };
  }
}
