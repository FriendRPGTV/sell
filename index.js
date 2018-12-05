'use strict';
const line = require('@line/bot-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const config = {
  channelAccessToken: process.env.TOKEN,
  channelSecret: process.env.SECRET,
};
let baseURL = 'https://razerforce.herokuapp.com/';
const port = process.env.PORT || 3000;
const client  = new line.Client(config);
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const web = {
  headerTop: '',
  headerBottom: '',
  bodyTop: '',
  bodyBottom: '',
  Footer: ''
};
web.headerTop = `<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css?v=1" rel="stylesheet" id="bootstrap-css">
<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js?v=1"></script>
<script src="//code.jquery.com/jquery-1.11.1.min.js?v=1"></script>
<!DOCTYPE html><html class=""><head>`;
web.headerBottom = `<meta charset="UTF-8">
<title>{{ChatManager}}</title>
<meta name="robots" content="noindex">
<!--<link rel="shortcut icon" type="image/x-icon" href="//production-assets.codepen.io/assets/favicon/favicon-8ea04875e70c4b0bb41da869e81236e54394d63638a1ef12fa558a4a835f1164.ico?v=1" />
<link rel="mask-icon" type="" href="//production-assets.codepen.io/assets/favicon/logo-pin-f2d2b6d2c61838f7e76325261b7195c27224080bc099486ddd6dccb469b8e8e6.svg?v=1" color="#111" />
<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700,300?v=1" rel="stylesheet" type="text/css">
--><script>try{Typekit.load({ async: true });}catch(e){}</script>
<link rel="stylesheet prefetch" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.2/css/font-awesome.min.css?v=1">
<link href="https://fonts.googleapis.com/css?family=Kanit" rel="stylesheet">
<link rel="stylesheet" href="{{style}}/css/style.css">
<style class="cp-pen-styles"></style>
</head>`;
web.bodyTop = `<body>
<div id="frame">
	<div id="sidepanel">
		<div id="profile">
			<div class="wrap">
				<img id="profile-img" src="https://obs.line-scdn.net/0hCU-pQ2FyHHoQCTH6APZjLSxMEhdnJxoyaG5WFTZZSkw7OQsrL20ETzQOR0M9Ow9-fz9UTmVcQRk4/preview" class="online" alt="" />
				<p>Razer Force</p>
				<i class="fa fa-chevron-down expand-button" aria-hidden="true"></i>
				<div id="status-options">
					<ul>
						<li id="status-online" class="active"><span class="status-circle"></span> <p>Online</p></li>
						<li id="status-away"><span class="status-circle"></span> <p>Away</p></li>
						<li id="status-busy"><span class="status-circle"></span> <p>Busy</p></li>
						<li id="status-offline"><span class="status-circle"></span> <p>Offline</p></li>
					</ul>
				</div>
				<div id="expanded">
					<label for="twitter"><i class="fa fa-facebook fa-fw" aria-hidden="true"></i></label>
					<input name="twitter" type="text" value="Razer Force" />
					<label for="twitter"><i class="fa fa-twitter fa-fw" aria-hidden="true"></i></label>
					<input name="twitter" type="text" value="https://line.me/R/ti/p/%40nxy1590n" />
					<label for="twitter"><i class="fa fa-instagram fa-fw" aria-hidden="true"></i></label>
					<input name="twitter" type="text" value="http://qr-official.line.me/L/z-LhoNApeq.png" />
				</div>
			</div>
		</div>
		<div id="search">
			<label for=""><i class="fa fa-search" aria-hidden="true"></i></label>
			<input type="text" placeholder="ค้นหาช้อความและห้องแชท" />
		</div>
		<div id="contacts">
			<ul>
				{{getUser}}
			</ul>
		</div>
		<div id="bottom-bar">
			<button id="friends"><i class="fa fa-user fa-fw" aria-hidden="true"></i> <span>Friends</span></button>
			<button id="groups"><i class="fa fa-users fa-fw" aria-hidden="true"></i> <span>Groups</span></button>
		</div>
	</div>
	<div class="content">
		{{getChat}}
		<div class="message-input">
			<div class="wrap">
			<input type="text" placeholder="เขียนข้อความ..." />
			<input type="file" accept="image/*" name="file" id="file" class="inputfile" /><label for="file"><i class="fa fa-paperclip attachment" aria-hidden="true"></i></label>
			<button class="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
			</div>
		</div>
	</div>
</div>`;
web.bodyBottom = `<script src='//production-assets.codepen.io/assets/common/stopExecutionOnTimeout-b2a7b3fe212eaa732349046d8416e00a9dec26eb7fd347590fbced3ab38af52e.js?v=1'></script>
<script src='https://code.jquery.com/jquery-2.2.4.min.js?v=1'></script>
<script>
$(".messages").animate({ scrollTop: $(document).height() }, "fast");

$("#profile-img").click(function() {
	$("#status-options").toggleClass("active");
});

$(".expand-button").click(function() {
  $("#profile").toggleClass("expanded");
	$("#contacts").toggleClass("expanded");
});

$("#status-options ul li").click(function() {
	$("#profile-img").removeClass();
	$("#status-online").removeClass("active");
	$("#status-away").removeClass("active");
	$("#status-busy").removeClass("active");
	$("#status-offline").removeClass("active");
	$(this).addClass("active");
	
	if($("#status-online").hasClass("active")) {
		$("#profile-img").addClass("online");
	} else if ($("#status-away").hasClass("active")) {
		$("#profile-img").addClass("away");
	} else if ($("#status-busy").hasClass("active")) {
		$("#profile-img").addClass("busy");
	} else if ($("#status-offline").hasClass("active")) {
		$("#profile-img").addClass("offline");
	} else {
		$("#profile-img").removeClass();
	};
	
	$("#status-options").removeClass("active");
});

function newMessage() {
	message = $(".message-input input").val();
	if($.trim(message) == '') {
		return false;
  }
  $.ajax({
	  contentType: 'application/json',
	  data: '{
	    "to": location.href,
	    "msg": message
	  }',
	  dataType: 'json',
	  success: function(data){
	    app.log("device control succeeded");
	  },
	  error: function(){
	    app.log("Device control failed");
	  },
	  processData: false,
	  type: 'POST',
	  url: '${baseURL}/push'
	});
	$('<li class="sent"><img src="https://obs.line-scdn.net/0hCU-pQ2FyHHoQCTH6APZjLSxMEhdnJxoyaG5WFTZZSkw7OQsrL20ETzQOR0M9Ow9-fz9UTmVcQRk4/preview" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
	$('.message-input input').val(null);
	$('.contact.active .preview').html('<span>คุณ: </span>' + message);
	$(".messages").animate({ scrollTop: $(document).height() }, "fast");
};
$('#friends').click(function() {
  location.href = '${baseURL}/u/1';
});
$('#groups').click(function() {
  location.href = '${baseURL}/g/1';
});
$('.submit').click(function() {
  newMessage();
});
$(window).on('keydown', function(e) {
  if (e.which == 13) {
    newMessage();
    return false;
  }
});
</script>`;
web.Footer = `</body></html>`;
/*
	<!---->*/
const db = {
  friends: [
    {
      id: '1',
      name: 'All Chat',
      avatar: 'https://obs.line-scdn.net/0hCU-pQ2FyHHoQCTH6APZjLSxMEhdnJxoyaG5WFTZZSkw7OQsrL20ETzQOR0M9Ow9-fz9UTmVcQRk4/preview',
      altmsg: '<span>คุณ:</span>  ยินดีต้อนรับสู่ห้องแชทบอท',
      message: [
        {
          type: 'sent',
          text: 'ยินดีต้อนรับสู่ห้องแชทบอท'
        }
      ]
    },
    {
      id: '2',
      name: 'Cha',
      avatar: 'https://aottgdf.github.io/images/Chakung.png?v=1',
      altmsg: 'สวัสดีครับผม',
      message: [
        {
          type: 'sent',
          text: 'สวัสดีครับ'
        },
        {
          type: 'replies',
          text: 'สวัสดีครับผม'
        }
      ]
    },
    {
      id: '3',
      name: 'เหมี้ยว',
      avatar: 'https://i.2th.me/a/i/wmp06odo/2th.me_3202515.jpg.th.jpg?v=1',
      altmsg: '<span>คุณ:</span> สวัสดีครับ',
      message: [
        {
          type: 'replies',
          text: 'สวัสดีค่ะ'
        },
        {
          type: 'sent',
          text: 'สวัสดีครับ'
        },
      ]
    }
  ]
};
function getUser(to, id) {
  let code = '';
  if (to === 'u' || to === 'g') {
    db.friends.forEach((p) => {
       code += `<li class="contact${(p.id == id ? ' active':'')}">
			      <a href="${baseURL}/chat/${to}/${p.id}">
					<div class="wrap">
					  <img src="${p.avatar}" alt="" />
					  <div class="meta">
						<p class="name">${p.name}</p>
						<p class="preview">${p.altmsg}</p>
					  </div>
					</div>
			      </a>
				</li>`;
    });
  }
  return code;
}

function getChat(to, id) {
let code = '';
    db.friends.forEach((p) => {
      if (p.id == id) {
        code += `<div class="contact-profile">
		<img src="${p.avatar}" alt="" />
			<p>${p.name}</p>
			<div class="social-media">
				<i class="fa fa-" aria-hidden="true"></i>
			</div>
		</div>`;
	  code += `<div class="messages"><ul>`;
	  p.message.forEach((m) => {
        code += `<li class="${m.type}">
					<img src="${(m.type == 'sent' ? db.friends[0].avatar : p.avatar)}" alt="" />
					<p>${m.text}</p>
				</li>`;
      });
      code += `</ul></div>`;
      }
    });
  return code;
}

const fs = require('fs');
/*fs.readFile('chat.html', (err, data) => {
  //web.headerTop = data;
});*/
app.use('/css', express.static('css'));
app.get('/', (req, res) => {
  res.send(`Open Chat <a href="${baseURL}/chat/u/1">Here</a>`);
});
app.get('/chat', (req, res) => {
    return res.redirect(baseURL+'chat/u/1');
    let code = web.headerTop+web.headerBottom+web.bodyTop+web.bodyBottom+web.Footer;
	let getFriends = getUser('u', db.friends[0].id);
	code = code.replace(/({{ChatManager}})/g, 'Chat Manager');
	code = code.replace(/({{style}})/g, baseURL);
	code = code.replace(/({{getUser}})/g, getFriends);
	res.send(code);
	res.end();
});
app.get('/chat/:to', (req, res) => {
  let to = req.params.to;
  if (to === 'u' || to === 'g') {
	if (web.headerTop === '') {
	  res.send(500);
	} else {
	  let code = web.headerTop+web.headerBottom+web.bodyTop+web.bodyBottom+web.Footer;
	  let getFriends = getUser(to, db.friends[0].id);
	  let getFriendsChat = getChat(to, db.friends[0].id);
	  code = code.replace(/({{ChatManager}})/g, 'Chat '+(to == 'u' ? 'Friends':'Groups'));
	  code = code.replace(/({{style}})/g, baseURL);
	  code = code.replace(/({{getUser}})/g, getFriends);
	  code = code.replace(/({{getChat}})/g, getFriendsChat);
	  res.send(code);
	  res.end();
	}
  } else {
	return res.redirect('../');
  }
  res.send('Sender: '+JSON.stringify(req.params));
});
app.get('/chat/:to/:id', (req, res) => {
  let to = req.params.to;
  let id = req.params.id;
  if (req.params.to === 'u' || req.params.to === 'g') {
	if (web.headerTop === '') {
	  res.send(500);
	} else {
	  let code = web.headerTop+web.headerBottom+web.bodyTop+web.bodyBottom+web.Footer;
	  let getFriends = getUser(to, id);
	  let getFriendsChat = getChat(to, id);
	  code = code.replace(/({{ChatManager}})/g, 'Chat '+(to == 'u' ? 'Friends':'Groups'));
	  code = code.replace(/({{style}})/g, baseURL);
	  code = code.replace(/({{getUser}})/g, getFriends);
	  code = code.replace(/({{getChat}})/g, getFriendsChat);
	  res.send(code);
	  res.end();
	}
  } else {
    return res.redirect('../');
  }
  res.send('Sender: '+JSON.stringify(req.params));
});
app.post('push', (req, res, next) => {
  let to = req.body.to;
  let msg = req.body.message;
  if (!to) return;
  let linkCheck = /https?:\/\/.+\.(?:png|jpg|jpeg)/gi;
  client.pushMessage(to, 
  {
    type: 'text',
    text: msg
  })
  .then(() => {
    console.log("Sent Push Message to "+to);
    res.end();
  })
  .catch((err) => {
    console.log(err);
  });
});
app.post('/callback', line.middleware(config), (req, res) => {
  if (req.body.destination) console.log("Destination User ID: " + req.body.destination);
  if (!Array.isArray(req.body.events)) return res.status(500).end();
  Promise
    .all(req.body.events.map(handleEvent))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const pushText = (to, texts) => {
  return client.pushMessage(to, { type: 'text', text: texts });
};

const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};

function handleEvent(event) {
  if (event.replyToken.match(/^(.)\1*$/)) {
    return console.log(`Test hook recieved: ` + JSON.stringify(event.message));
  }

  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken, event.source);
        case 'image':
          if (event.source.type == 'group') return;
          return handleImage(message, event.replyToken);
        case 'video':
          if (event.source.type == 'group') return;
          return handleVideo(message, event.replyToken);
        case 'audio':
          if (event.source.type == 'group') return;
          return handleAudio(message, event.replyToken);
        case 'location':
          if (event.source.type == 'group') return;
          return handleLocation(message, event.replyToken);
        case 'sticker':
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      return replyText(event.replyToken, 'ยินดีต้อนรับสู่ห้องแชทบอท');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      return replyText(event.replyToken, `สวัสดีครับ ผมคือแชทบอท Message Api`);

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);
    
    case 'postback':
      let data = event.postback.data;
      if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
        data += `(${JSON.stringify(event.postback.params)})`;
      }
      return replyText(event.replyToken, `ตอบกลับ: ${data}`);

    case 'beacon':
      return replyText(event.replyToken, `Beacon: ${event.beacon.hwid}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function handleMessage(message, replyToken, source) {
  let msg = message.text;
  let to = replyToken;
  if (!to) return;
  if (msg.includes('สวัสดี')) {
    return replyText(to, 'สวัสดีครับ');
  }
  if (msg.startsWith('!eval')) {
    let cmd = msg.slice(6);
    eval(cmd.join(' ')).catch((err)=>{console.log(err)});
  }
}

function handleText(message, replyToken, source) {
  const buttonsImageURL = `${baseURL}/static/buttons/1040.jpg`;
  switch (message.text) {
    case 'invite':
      return replyText(replyToken, `เข้ากลุ่มแชทบอท\n${botInvite}`);
    case 'profile':
      if (source.userId) {
        var profile;
        try {
          client.getProfile(source.userId)
          .then((p) => {
            profile = p;
          });
        } catch(err) {
          console.error(err);
        }
        return replyText(replyToken, `ชื่อ: ${profile.displayName}\nสถานะ: ${profile.statusMessage}`);
      } else {
        return replyText(replyToken, 'คุณไม่สามารถใช้คำสั่งนี้ได้ค่ะ');
      }
    case '!buttons':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Buttons alt text',
          template: {
            type: 'buttons',
            thumbnailImageUrl: buttonsImageURL,
            title: 'My button sample',
            text: 'Hello, my button',
            actions: [
              { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
              { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
              { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
              { label: 'Say message', type: 'message', text: 'Rice=米' },
            ],
          },
        }
      );
    case '!confirm':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Confirm alt text',
          template: {
            type: 'confirm',
            text: 'Do it?',
            actions: [
              { label: 'Yes', type: 'message', text: 'Yes!' },
              { label: 'No', type: 'message', text: 'No!' },
            ],
          },
        }
      )
    case '!carousel':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Carousel alt text',
          template: {
            type: 'carousel',
            columns: [
              {
                thumbnailImageUrl: buttonsImageURL,
                title: 'hoge',
                text: 'fuga',
                actions: [
                  { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
                  { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                ],
              },
              {
                thumbnailImageUrl: buttonsImageURL,
                title: 'hoge',
                text: 'fuga',
                actions: [
                  { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
                  { label: 'Say message', type: 'message', text: 'Rice=米' },
                ],
              },
            ],
          },
        }
      );
    case '!image carousel':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Image carousel alt text',
          template: {
            type: 'image_carousel',
            columns: [
              {
                imageUrl: buttonsImageURL,
                action: { label: 'Go to LINE', type: 'uri', uri: 'https://line.me' },
              },
              {
                imageUrl: buttonsImageURL,
                action: { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
              },
              {
                imageUrl: buttonsImageURL,
                action: { label: 'Say message', type: 'message', text: 'Rice=米' },
              },
              {
                imageUrl: buttonsImageURL,
                action: {
                  label: 'datetime',
                  type: 'datetimepicker',
                  data: 'DATETIME',
                  mode: 'datetime',
                },
              },
            ]
          },
        }
      );
    case '!datetime':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Datetime pickers alt text',
          template: {
            type: 'buttons',
            text: 'Select date / time !',
            actions: [
              { type: 'datetimepicker', label: 'date', data: 'DATE', mode: 'date' },
              { type: 'datetimepicker', label: 'time', data: 'TIME', mode: 'time' },
              { type: 'datetimepicker', label: 'datetime', data: 'DATETIME', mode: 'datetime' },
            ],
          },
        }
      );
    case '.imagemap':
      return client.replyMessage(
        replyToken,
        {
          type: 'imagemap',
          baseUrl: `${baseURL}/static/rich`,
          altText: 'Imagemap alt text',
          baseSize: { width: 1040, height: 1040 },
          actions: [
            { area: { x: 0, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/manga/en' },
            { area: { x: 520, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/music/en' },
            { area: { x: 0, y: 520, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/play/en' },
            { area: { x: 520, y: 520, width: 520, height: 520 }, type: 'message', text: 'URANAI!' },
          ],
          video: {
            originalContentUrl: `${baseURL}/static/imagemap/video.mp4`,
            previewImageUrl: `${baseURL}/static/imagemap/preview.jpg`,
            area: {
              x: 280,
              y: 385,
              width: 480,
              height: 270,
            },
            externalLink: {
              linkUri: 'https://line.me',
              label: 'LINE'
            }
          },
        }
      );
    case 'bye':
      switch (source.type) {
        case 'user':
          return replyText(replyToken, 'Bot can\'t leave from 1:1 chat');
        case 'group':
          return replyText(replyToken, '✅ | กำลังออกจากกลุ่มค่ะ')
            .then(() => client.leaveGroup(source.groupId));
        case 'room':
          return replyText(replyToken, '✅ | กำลังออกจากห้องค่ะ')
            .then(() => client.leaveRoom(source.roomId));
      }
    default:
      return handleMessage(message, replyToken, source);
      
  }
}

function handleImage(message, replyToken) {
  let getContent;
  if (message.contentProvider.type === "line") {
    var downloadPath = path.join(__dirname, 'downloaded', `${message.id}.jpg`);
    var previewPath = path.join(__dirname, 'downloaded', `${message.id}-preview.jpg`);
    getContent = downloadContent(message.id, downloadPath)
      .then((downloadPath) => {
        cp.execSync(`convert -resize 240x jpeg:${downloadPath} jpeg:${previewPath}`);
        return {
          originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
          previewImageUrl: baseURL + '/downloaded/' + path.basename(previewPath),
        };
      });
  } else if (message.contentProvider.type === "external") {
    getContent = Promise.resolve(message.contentProvider);
  }
  var image_url;
  return getContent
    .then(({ originalContentUrl, previewImageUrl }) => {
      image_url = originalContentUrl.originalContentUrl;
      return client.replyMessage(
        replyToken,
        {
          type: 'image',
          originalContentUrl,
          previewImageUrl,
        }
      )
    });
}

function handleVideo(message, replyToken) {
  let getContent;
  if (message.contentProvider.type === "line") {
    const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.mp4`);
    const previewPath = path.join(__dirname, 'downloaded', `${message.id}-preview.jpg`);
    getContent = downloadContent(message.id, downloadPath)
      .then((downloadPath) => {
        cp.execSync(`convert mp4:${downloadPath}[0] jpeg:${previewPath}`);

        return {
          originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
          previewImageUrl: baseURL + '/downloaded/' + path.basename(previewPath),
        }
      });
  } else if (message.contentProvider.type === "external") {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent
    .then(({ originalContentUrl, previewImageUrl }) => {
      return client.replyMessage(
        replyToken,
        {
          type: 'video',
          originalContentUrl,
          previewImageUrl,
        }
      );
    });
}

function handleAudio(message, replyToken) {
  let getContent;
  if (message.contentProvider.type === "line") {
    const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.m4a`);
    getContent = downloadContent(message.id, downloadPath)
      .then((downloadPath) => {
        return {
            originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
        };
      });
  } else {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent
    .then(({ originalContentUrl }) => {
      return client.replyMessage(
        replyToken,
        {
          type: 'audio',
          originalContentUrl,
          duration: message.duration,
        }
      );
    });
}

function downloadContent(messageId, downloadPath) {
  return client.getMessageContent(messageId)
    .then((stream) => new Promise((resolve, reject) => {
      const writable = fs.createWriteStream(downloadPath);
      stream.pipe(writable);
      stream.on('end', () => resolve(downloadPath));
      stream.on('error', reject);
    }));
}

function handleLocation(message, replyToken) {
  return client.replyMessage(
    replyToken,
    {
      type: 'location',
      title: message.title,
      address: message.address,
      latitude: message.latitude,
      longitude: message.longitude,
    }
  );
}

function handleSticker(message, replyToken) {
  if (!message.packageId) return;
  return client.replyMessage(
    replyToken,
    {
      type: 'sticker',
      packageId: message.packageId,
      stickerId: message.stickerId,
    }
  );
}

app.listen(port, () => {
  if (baseURL) {
    console.log('listening on '+baseURL+':'+port+'/callback');
  } else {
    console.log("It seems that BASE_URL is not set.");
  }
});