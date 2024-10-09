import { simpleParser } from 'mailparser';

export const POST = async ({ request }) => {
  const formData = await request.formData();
  const emlFile = formData.get('emlFile');
  console.log('폼 데이터 정보:');
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  
  if (!emlFile) {
    return new Response(JSON.stringify({ error: '업로드된 파일이 없습니다' }), { status: 400 });
  }

  // File 객체를 ArrayBuffer로 변환
  const arrayBuffer = await emlFile.arrayBuffer();
  const emlBuffer = Buffer.from(arrayBuffer);

  // EML 파일을 파싱
  const parsedEmail = await simpleParser(emlBuffer);

  const formatAttachment = (attachment) => {
    return {
      filename: attachment.filename,
      contentType: attachment.contentType,
      size: attachment.size,
      content: attachment.content.toString('base64'), // 파일 다운로드를 위해 base64로 인코딩
    };
  };

  const formatPart = (part) => {
    let formattedPart = {
      contentType: part.contentType,
      content: part.text || part.html,
    };

    if (part.childNodes && part.childNodes.length > 0) {
      formattedPart.childNodes = part.childNodes.map(formatPart);
    }

    return formattedPart;
  };

  const formattedEmail = {
    subject: parsedEmail.subject || '제목 없음',
    from: parsedEmail.from?.text || '알 수 없는 발신자',
    to: parsedEmail.to?.text || '알 수 없는 수신자',
    cc: parsedEmail.cc?.text || '',
    bcc: parsedEmail.bcc?.text || '',
    date: parsedEmail.date?.toISOString() || '',
    text: parsedEmail.text || '본문 내용 없음',
    html: parsedEmail.html || '',
    attachments: parsedEmail.attachments?.map(formatAttachment) || [],
    headers: parsedEmail.headers,
    messageId: parsedEmail.messageId,
    inReplyTo: parsedEmail.inReplyTo,
    references: parsedEmail.references,
  };

  // HTML 본문이 있는 경우 우선적으로 사용
  if (parsedEmail.html) {
    formattedEmail.content = parsedEmail.html;
    formattedEmail.contentType = 'html';
  } else if (parsedEmail.textAsHtml) {
    formattedEmail.content = parsedEmail.textAsHtml;
    formattedEmail.contentType = 'html';
  } else if (parsedEmail.text) {
    formattedEmail.content = parsedEmail.text;
    formattedEmail.contentType = 'text';
  } else {
    formattedEmail.content = '본문 내용 없음';
    formattedEmail.contentType = 'text';
  }

  if (parsedEmail.parts && parsedEmail.parts.length > 0) {
    formattedEmail.parts = parsedEmail.parts.map(formatPart);
  }

  return new Response(JSON.stringify(formattedEmail), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
