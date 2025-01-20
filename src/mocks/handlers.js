/* intercept할 API들의 요청과 응답을 작성 */

import { rest } from 'msw';
import { placesNearbyData } from './data/placesNearbyData';
import { placesData } from './data/placesData';

const API_URL = process.env.REACT_APP_API_URL;

// request를 인터셉트하고 response를 핸들링함.

export const handlers = [
  // 주변 카페 api 핸들러
  rest.get(`${API_URL}/api/places/nearby`, (req, res, ctx) => {
    // placesApi와 형태 맞춰서, 쿼리 파라미터로 x,y,radius를 전달해야 함.
    const x = req.url.searchParams.get('x');
    const y = req.url.searchParams.get('y');
    const radius = req.url.searchParams.get('radius');

    console.log(`Captured a "GET /api/places/nearby" request`);

    return res(ctx.status(200), ctx.json(placesNearbyData({ x, y, radius })));
  }),

  // 특정 카페 정보 api 핸들러
  rest.get(`${API_URL}/api/places/:placeId`, (req, res, ctx) => {
    // req.params.placeId로 URL의 placeId 가져옴
    const { placeId } = req.params;
    console.log(`Captured a "GET /api/places/${placeId}" request`);

    return res(ctx.status(200), ctx.json(placesData));
  }),
];
