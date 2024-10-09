<script>
  let emlFile;
  let parsedEmail = null;
  let iframeHeight = 300;

  async function handleSubmit() {
    const formData = new FormData();
    formData.append('emlFile', emlFile[0]);

    const res = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });

    parsedEmail = await res.json();
  }

  function adjustIframeHeight(iframe) {
    if (iframe) {
      iframe.onload = () => {
        iframeHeight = iframe.contentWindow.document.body.scrollHeight + 20;
      };
    }
  }

  function downloadAttachment(attachment) {
    const blob = new Blob([Uint8Array.from(atob(attachment.content), c => c.charCodeAt(0))], { type: attachment.contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = attachment.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

<main class="p-4">
  <h1 class="text-2xl font-bold mb-4">EML 파일 업로드 및 파싱</h1>
  
  <div class="mb-4">
    <form on:submit|preventDefault={handleSubmit} class="flex items-center">
      <input type="file" bind:files={emlFile} accept=".eml" class="mr-2" />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">업로드 및 파싱</button>
    </form>
  </div>

  {#if parsedEmail}
		<h2 class="text-xl font-semibold mb-2">이메일 정보</h2>
		<div class="grid grid-cols-2 gap-2 mb-4">
			<p><strong>제목:</strong> {parsedEmail.subject}</p>
			<p><strong>보낸 사람:</strong> {parsedEmail.from}</p>
			<p><strong>받는 사람:</strong> {parsedEmail.to}</p>
			<p><strong>참조:</strong> {parsedEmail.cc}</p>
			<p><strong>숨은 참조:</strong> {parsedEmail.bcc}</p>
			<p><strong>날짜:</strong> {parsedEmail.date}</p>
			<p><strong>메시지 ID:</strong> {parsedEmail.messageId}</p>
			<p><strong>답장 대상:</strong> {parsedEmail.inReplyTo}</p>
		</div>

		<h3 class="text-lg font-semibold mb-2">본문</h3>
		{#if parsedEmail.contentType === 'html'}
			<div class="bg-white p-4 rounded">
				<iframe srcdoc={parsedEmail.content} title="이메일 본문" class="w-full border-0" style="height: {iframeHeight}px;" use:adjustIframeHeight></iframe>
			</div>
		{:else}
			<pre class="border p-2 rounded whitespace-pre-wrap bg-transparent">{parsedEmail.content}</pre>
		{/if}

		{#if parsedEmail.attachments && parsedEmail.attachments.length > 0}
			<h3 class="text-lg font-semibold mt-4 mb-2">첨부 파일</h3>
			<ul class="list-disc pl-5">
				{#each parsedEmail.attachments as attachment}
					<li>
						{attachment.filename} ({attachment.contentType}, {attachment.size} bytes)
						<button on:click={() => downloadAttachment(attachment)} class="ml-2 bg-green-500 text-white px-2 py-1 rounded text-sm">다운로드</button>
					</li>
				{/each}
			</ul>
		{/if}
  {/if}
</main>
