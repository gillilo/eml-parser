import { simpleParser } from 'mailparser';

const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const emlFile = formData.get("emlFile");
    if (!emlFile) {
      return new Response(JSON.stringify({ error: "업로드된 파일이 없습니다" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
          // 모든 출처 허용
        }
      });
    }
    const arrayBuffer = await emlFile.arrayBuffer();
    const emlBuffer = Buffer.from(arrayBuffer);
    const parsedEmail = await simpleParser(emlBuffer);
    const formatAttachment = (attachment) => {
      return {
        filename: attachment.filename,
        contentType: attachment.contentType,
        size: attachment.size,
        content: attachment.content.toString("base64")
        // 파일 다운로드를 위해 base64로 인코딩
      };
    };
    const formatPart = (part) => {
      let formattedPart = {
        contentType: part.contentType,
        content: part.text || part.html
      };
      if (part.childNodes && part.childNodes.length > 0) {
        formattedPart.childNodes = part.childNodes.map(formatPart);
      }
      return formattedPart;
    };
    const formattedEmail = {
      subject: parsedEmail.subject || "제목 없음",
      from: parsedEmail.from?.text || "알 수 없는 발신자",
      to: parsedEmail.to?.text || "알 수 없는 수신자",
      cc: parsedEmail.cc?.text || "",
      bcc: parsedEmail.bcc?.text || "",
      date: parsedEmail.date?.toISOString() || "",
      text: parsedEmail.text || "본문 내용 없음",
      html: parsedEmail.html || "",
      attachments: parsedEmail.attachments?.map(formatAttachment) || [],
      headers: parsedEmail.headers,
      messageId: parsedEmail.messageId,
      inReplyTo: parsedEmail.inReplyTo,
      references: parsedEmail.references
    };
    if (parsedEmail.html) {
      formattedEmail.content = parsedEmail.html;
      formattedEmail.contentType = "html";
    } else if (parsedEmail.textAsHtml) {
      formattedEmail.content = parsedEmail.textAsHtml;
      formattedEmail.contentType = "html";
    } else if (parsedEmail.text) {
      formattedEmail.content = parsedEmail.text;
      formattedEmail.contentType = "text";
    } else {
      formattedEmail.content = "본문 내용 없음";
      formattedEmail.contentType = "text";
    }
    if (parsedEmail.parts && parsedEmail.parts.length > 0) {
      formattedEmail.parts = parsedEmail.parts.map(formatPart);
    }
    return new Response(JSON.stringify(formattedEmail), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        // CORS 허용
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    console.error("이메일 파싱 중 오류 발생:", error);
    return new Response(JSON.stringify({ error: "이메일 파싱 중 오류가 발생했습니다" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
        // CORS 허용
      }
    });
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      // 모든 출처 허용
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      // 허용할 메서드
      "Access-Control-Allow-Headers": "Content-Type"
      // 허용할 헤더
    }
  });
};

export { OPTIONS, POST };
//# sourceMappingURL=_server-O9yxweRf.js.map
