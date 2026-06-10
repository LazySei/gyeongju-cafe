export async function onRequest(context) {
    // 1. 환경변수 확인
    const API_KEY = context.env.API_KEY; 
    if (!API_KEY) {
        return new Response(JSON.stringify({ error: "환경변수 API_KEY가 설정되지 않았습니다." }), { status: 500 });
    }

    // 2. HTTP를 HTTPS로 변경
    const baseUrl = "https://apis.data.go.kr/15114467/openapi.do/getCafeInfo";
    
    // 3. API 키 URL 인코딩 처리 (Encoding 키를 환경변수에 넣은 경우)
    // 만약 공공데이터포털의 'Decoding' 키를 환경변수에 넣었다면 encodeURIComponent()로 감싸주어야 합니다.
    const url = `${baseUrl}?serviceKey=${encodeURIComponent(API_KEY)}&pageNo=1&numOfRows=50&type=json`;

    try {
        const response = await fetch(url);
        
        // 4. 응답을 텍스트로 먼저 받아서 확인 (JSON 파싱 에러 방지)
        const textData = await response.text();
        
        // 공공데이터 에러 시 XML을 반환하는 경우를 확인하기 위한 로직
        if (textData.startsWith('<')) {
            return new Response(JSON.stringify({ 
                error: "공공데이터포털에서 XML 에러를 반환했습니다. API 키나 파라미터를 확인하세요.", 
                details: textData 
            }), { 
                status: 500,
                headers: { "Content-Type": "application/json;charset=UTF-8" }
            });
        }

        // 정상적인 JSON 응답일 경우
        const jsonData = JSON.parse(textData);
        
        return new Response(JSON.stringify(jsonData), {
            headers: { 
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
        });

    } catch (error) {
        // 5. 정확한 에러 메시지 출력
        return new Response(JSON.stringify({ 
            error: "데이터 호출 중 서버 내부 오류 발생", 
            message: error.message 
        }), { 
            status: 500,
            headers: { "Content-Type": "application/json;charset=UTF-8" }
        });
    }
}
