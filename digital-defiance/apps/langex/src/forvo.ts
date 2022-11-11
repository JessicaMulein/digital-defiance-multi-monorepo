import * as $ from 'jquery';

async function getForvoSoundSources(text: string): Promise<string | null> {
  const url = 'https://forvo.com/search/' + encodeURIComponent(text) + '/ja';
  let result: string | null = null;
  await $.ajax(url).done(function (data) {
    const play = $(data).find('.results_match .play');

    if (play.length == 0) {
      result = null;
      return;
    }

    const onclickAttr = play.first().attr('onclick');
    if (onclickAttr === undefined) {
      result = null;
      return;
    }
    const raw = onclickAttr.split("'");
    const audio_obj = $('<audio>');
    if (raw[5] != '') {
      const mp3h =
        'https://audio00.forvo.com/audios/mp3/' +
        encodeURIComponent(Buffer.from(raw[5], 'base64').toString('ascii'));
      audio_obj.append(
        $('<source>').attr('src', mp3h).attr('type', 'audio/mpeg')
      );
    }
    if (raw[7] != '') {
      const oggh =
        'https://audio00.forvo.com/audios/ogg/' +
        encodeURIComponent(Buffer.from(raw[7], 'base64').toString('ascii'));
      audio_obj.append(
        $('<source>').attr('src', oggh).attr('type', 'audio/ogg')
      );
    }
    const mp3l =
      'https://audio00.forvo.com/mp3/' +
      encodeURIComponent(Buffer.from(raw[1], 'base64').toString('ascii'));
    audio_obj.append(
      $('<source>').attr('src', mp3l).attr('type', 'audio/mpeg')
    );
    const oggl =
      'https://audio00.forvo.com/ogg/' +
      encodeURIComponent(Buffer.from(raw[3], 'base64').toString('ascii'));
    audio_obj.append($('<source>').attr('src', oggl).attr('type', 'audio/ogg'));
    result = audio_obj[0].outerHTML;
  });
  return result;
}
