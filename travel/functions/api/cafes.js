export async function onRequest(context) {
  // 1. 환경변수(Cloudflare에 설정할 값)와 요청 객체 가져오기
  const { env, request } = context;
  const apiKey = env.DATA_GO_KR_API_KEY; // Cloudflare에서 설정할 환경변수 이름

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API 키가 설정되지 않았습니다." }), { status: 500 });
  }

  // 2. 클라이언트 요청 URL에서 파라미터(페이지 번호 등) 추출
  const url = new URL(request.url);
  const pageNo = url.searchParams.get('pageNo') || '1';
  const numOfRows = url.searchParams.get('numOfRows') || '10';

  // 3. 공공데이터 API 실제 엔드포인트 구성
  // 참고: 엔드포인트 URL은 공공데이터포털 활용가이드 문서의 정확한 주소로 변경해야 할 수 있습니다.
  const apiUrl = `https://apis.data.go.kr/5050000/cafeInfoService/getCafeInfo?serviceKey=${apiKey}&pageNo=${pageNo}&numOfRows=${numOfRows}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // 4. 가져온 데이터를 클라이언트(웹브라우저)로 전달
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "데이터를 불러오는 중 오류가 발생했습니다." }), { status: 500 });
  }
}