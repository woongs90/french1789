//=============================================================================
// EscapeRoom.js  (RPG Maker MV)
// 걸어 다니며 조사하는 방탈출 엔진 v3.7 (어드벤처 · 잠행 · 미션 · 타이밍 · 체력 · 함정 · 활)
//=============================================================================
/*:
 * @plugindesc 걸어 다니며 조사하는 방탈출 엔진 - 이벤트 이름과 데이터 파일 하나로 단서, 자물쇠, 퀴즈를 만듭니다.
 * @author Claude
 *
 * @param DataFile
 * @text 데이터 파일 이름
 * @desc data 폴더 안에 있는 방탈출 데이터 파일 이름입니다.
 * @default EscapeData.json
 *
 * @param WallRegion
 * @text 벽 리전 번호
 * @type number
 * @min 1
 * @max 255
 * @desc 이 번호의 리전을 칠한 칸은 지나갈 수 없습니다.
 * @default 1
 *
 * @param ShowDebug
 * @text 제작 도우미 보기
 * @type boolean
 * @on 보기
 * @off 숨기기
 * @desc 켜면 벽(리전), 조사 이벤트 이름, 주인공 좌표가 화면에 보입니다. 제작할 때만 켜세요.
 * @default false
 *
 * @param SeDoor
 * @text 효과음: 문 열림
 * @desc audio/se 폴더의 효과음 이름. 파일이 없으면 소리만 나지 않고 게임은 그대로 진행됩니다.
 * @default Open1
 *
 * @param SeSolve
 * @text 효과음: 퍼즐 해결
 * @default Chime2
 *
 * @param SeItem
 * @text 효과음: 아이템 획득
 * @default Item3
 *
 * @param SeGate
 * @text 효과음: 시간의 문
 * @default Teleport
 *
 * @param SeWarp
 * @text 효과음: 시대 이동
 * @default Move1
 *
 * @param SeaRegion
 * @text 바다 리전 번호
 * @type number
 * @desc 이 리전은 배를 탔을 때만 지나갈 수 있습니다. (걸어서는 못 감)
 * @default 2
 *
 * @param DockRegion
 * @text 부두 리전 번호
 * @type number
 * @desc 이 리전은 걸어서도, 배로도 지나갈 수 있습니다. (배 타고 내리는 곳)
 * @default 3
 *
 * @param Fullscreen
 * @text 시작할 때 전체 화면
 * @type boolean
 * @on 켜기
 * @off 끄기
 * @desc 타이틀 화면을 누르는 순간 브라우저 전체 화면(주소창 숨김)으로 바꿉니다. 컴퓨터·안드로이드 브라우저에서 동작 (아이폰은 지원 안 함).
 * @default true
 *
 * @param FullscreenButton
 * @text 전체 화면 버튼
 * @type boolean
 * @on 보이기
 * @off 숨기기
 * @desc 게임 화면 위쪽에 [전체 화면] 버튼을 보여 줍니다. (지원하지 않는 기기에서는 자동으로 숨김)
 * @default true
 *
 * @param AutoWidth
 * @text 화면 비율 자동 맞춤
 * @type boolean
 * @on 자동
 * @off 끄기(기본 크기)
 * @desc 켜면 기기 화면 비율에 맞춰 화면 가로 크기를 정합니다(세로 624 고정). 지도는 가운데에 고정됩니다.
 * @default true
 *
 * @param MaxWidth
 * @text 가장 넓은 화면 가로(px)
 * @type number
 * @min 816
 * @desc 자동 맞춤일 때 화면 가로의 최댓값. 지도 가로 칸 수 x 48 이하로 두세요. (29칸 지도 = 1392)
 * @default 1392
 *
 * @help
 * ============================================================================
 *  사용 방법 (자세한 내용은 함께 드린 안내서를 보세요)
 * ============================================================================
 *  - 방 하나 = 맵 하나. 데이터 파일의 각 방에 "map": 맵 번호 를 적습니다.
 *  - 조사할 물건 = 이벤트. 이벤트 '이름'을 데이터 파일의 조사 지점 id와
 *    똑같이 적으면, 그 앞에서 결정키를 눌렀을 때 데이터 파일 내용이 실행됩니다.
 *    이벤트 내용(실행 내용)은 비워 둬도 됩니다.
 *    큰 물건은 같은 이름의 이벤트를 여러 칸에 놓으면 됩니다.
 *  - 문처럼 걸어 들어가면 반응해야 하는 곳은 이벤트 트리거를
 *    '플레이어로부터 접촉'으로 바꾸세요.
 *  - 지나가면 안 되는 곳은 리전 1번(설정에서 변경 가능)을 칠합니다.
 *  - ESC / X / 오른쪽 클릭: 가방,  H: 힌트
 *
 *  v2.1 추가 기능
 *  - 다이얼 자물쇠: 글자·방향·색깔 등 여러 칸을 돌려 맞추는 자물쇠 ("dial")
 *  - 주인공 고르기: 데이터 파일의 "characters" 목록에서 고르기 ("selectCharacter")
 *  - 캐릭터 그림이 있는 조사 이벤트(NPC)는 말을 걸면 주인공 쪽으로 돌아봅니다.
 *
 *  v2.2 효과
 *  - 문 열림, 퍼즐 해결, 아이템 획득, 오답, 시대 이동, 시간의 문 연출
 *  - 효과음은 audio/se에 파일이 없으면 소리만 나지 않고 게임은 멈추지 않습니다.
 *
 *  v2.3 타이틀·음악·영상 (모두 데이터 파일에서 지정)
 *  - "gameTitle", "titleImage"(img/titles1), "titleText", "titleBgm"
 *  - "bgm"(기본), 방마다 "bgm", "endingBgm", 단계 { "bgm": "곡 이름" }
 *  - 단계 { "movie": "영상 이름" } : movies 폴더의 .webm/.mp4, Enter·클릭으로 건너뛰기
 *  - 파일이 없으면 그 기능만 조용히 건너뜁니다.
 *
 *  v2.4 후기 링크
 *  - 데이터 파일의 "review": { "url": "...", "picture": "...", "text": "..." }
 *    엔딩 정리가 끝난 뒤 안내 화면이 나오고, Enter·클릭을 누르는 순간 링크가 열립니다.
 *  - 단계에 "openUrl"을 붙여도 같은 방식으로 링크를 엽니다.
 *
 *  v2.6 화면 비율 자동 맞춤
 *  - 기기(창) 비율에 맞춰 화면 가로를 816~MaxWidth 사이에서 정합니다.
 *    4:3 태블릿은 816, 16:9 크롬북은 약 1104, 휴대폰 가로는 약 1300.
 *  - 지도는 언제나 가운데에 고정됩니다. 지도를 화면보다 넓게(예: 29칸) 만들고
 *    가운데 17칸에 꼭 필요한 것을 두면, 넓은 화면에서는 양옆 장식이 더 보입니다.
 *  - 화면을 돌리거나 창 크기를 바꾸면, 타이틀 화면이나 자유롭게 걷는 중일 때
 *    자동으로 다시 맞춥니다.
 *  - 휴대폰·태블릿: 톡 눌러 이동/조사, 창 바깥을 누르면 닫기, 세로일 때 가로 안내.
 *
 *  v3.0 어드벤처 기능
 *  - 방에 "camera": "follow" 를 적으면 넓은 지도에서 화면이 주인공을 따라갑니다.
 *  - 배 타기: 단계 { "boat": true } / { "boat": false }.  "go"와 함께 쓰면 도착할 때 바뀝니다.
 *    바다 리전(2)은 배로만, 부두 리전(3)은 둘 다 지나갈 수 있습니다. 배 그림은 "boatSprite".
 *  - 추격: 단계 { "chase": { "targets": [이벤트 이름…], "time": 초, "speed": 4,
 *    "success": [...], "fail": [...] } }  제한 시간 안에 모두 따라잡으면 성공.
 *  - 동료: 데이터 "companion": { "actor": 2, "image": "$gaji", "flag": "나타나는 플래그" }
 *    따라다니는 동료(배를 타면 숨음).
 *  - 목표 안내: 단계 { "goal": "동래로 가서 안용복을 만나자" } → 화면 왼쪽 위에 표시.
 *
 *  v3.1 시작할 때 전체 화면
 *  - 타이틀 화면을 누르는 순간 브라우저 주소창까지 숨기는 전체 화면이 됩니다.
 *    (컴퓨터·안드로이드. 아이폰은 브라우저가 막아 둠. ESC를 누르면 전체 화면이 풀림)
 *  - 끄려면 플러그인 설정 "시작할 때 전체 화면"을 [끄기]로.
 *
 *  v3.7 회상 장면 · 진흙 · 추위
 *  - 방 "memory": true + "tint": [40, 14, -34, 255] → 인물까지 옛날 사진 색 + 낡은 필름 무늬 (fx_memory1·2)
 *  - 리전 5 = 진흙 (걸음이 느려짐)
 *  - 방 "drain": { "every": 600, "damage": 1, "text": "..." } → 일정 시간마다 하트 -1 (아이템 effect "warm"은 느리게)
 *  - 방 "older": true → 주인공 그림을 '이름_old'(어른이 된 모습)로 바꿔 보여 줌 (예: $f_boy → $f_boy_old)
 *
 *  v3.6 이어하기 (서버 없이 브라우저에 저장 + 4자리 이어하기 번호)
 *  - 데이터 "progress": { "key": "china", "units": [{ "flag": "hall1", "flags": [...], "items": [...] }, ...],
 *      "base": { "flags": [...] }, "keepItems": [보물 등] }
 *  - 단계 { "progressSave": true }  → 끝낸 단위(관)를 이 기기 브라우저에 저장, 글 속 {code} = 이어하기 번호
 *  - 단계 { "progressLoad": true } / { "progressClear": true }, 조건 { "progressSaved": true }
 *  - 자물쇠 { "lock": { "progress": true, "digits": 4 }, "success": [...], "fail": [...] } → 번호로 이어하기
 *
 *  v3.5 조건 단계 · 확대 그림 겹치기 · 눌러서 조준
 *  - 단계 { "if": 조건, "then": [단계...], "else": [단계...] } → 조건에 따라 다른 단계
 *  - 단계 { "picture": "판", "overlays": [{ "picture": "칸1", "if": 조건 }, ...] }
 *    → 같은 크기의 투명 그림을 조건이 맞을 때만 위에 겹쳐 보여 줌 (연표에 조각 끼우기 등)
 *  - 방 "darkArea": [x0,y0,x1,y1] → "dark" 어둠이 그 네모 구역 안에서만 (석굴 안 등)
 *  - 힌트 수수께끼에 "rooms": [방 id...] 를 쓰면 그 방에 있을 때 그 힌트를 먼저 보여 줌
 *  - 활: 과녁이나 리전 4 칸을 손가락(마우스)으로 누르면 그 쪽으로 바로 쏨 (휴대폰용)
 *
 *  v3.4 체력 · 함정 · 움직이는 것 · 활 · 어둠 · 아이템 효과
 *  - 데이터 "hp": 3 → 체력 하트. 단계 { "damage": 1 } { "heal": 1 }. 다 떨어지면 방의 "ko" 단계 후 "checkpoint"로
 *  - 방 "traps": { "tiles": [[x,y]...], "count": 5, "kind": "pit"|"spike"|"mixed" } → 들어갈 때마다 무작위 자리
 *    "trapsIf": 조건 (함정이 켜지는 때)
 *  - 방 "movers": [{ "event": "돌1", "route": [[x,y],[x,y]], "speed": 4, "damage": 1, "loop": "restart", "if": 조건 }]
 *  - 방 "bow": true 또는 조건 → A·F 키 / 오른쪽 아래 버튼으로 화살. 조사 지점 "target": { "flag": "...", "steps": [] }
 *    미션 중에는 화살로 맞힌 과녁이 미션 대상으로 셈
 *  - 방 "dark": 3 → 주인공 둘레 3칸만 보임. 아이템 "effect": "light" 하나마다 +2칸
 *  - 아이템 "effect": "speed"(빨라짐) / "charm"(감시에 한 번 들켜도 괜찮음, 쓰면 사라짐) / "light"
 *  - 단계 { "random": [[단계...], [단계...]] } → 그중 하나를 무작위로
 *  - 리전 4 = 낮은 울타리 (걸어서는 못 지나가지만 화살은 넘어감 - 활터 과녁 줄 등)
 *
 *  - 인트로 영상은 기본으로 건너뛸 수 없음. 건너뛰게 하려면 데이터에 "movieSkip": true
 *    (또는 단계 { "movie": "이름", "skip": true }). 영상 파일이 고장 나 멈추면 자동으로 넘어감.
 *
 *  v3.2 잠행 · 미션 · 타이밍 · 퀴즈 힌트
 *  - 감시(잠행): 방에 "watchers": [{ "event": "순사1", "route": [[x,y],[x,y]], "sight": 4 }]
 *    "watchIf": 조건, "checkpoint": [x,y,"up"], "caught": [단계...]  → 시야(빨간 칸)에 들어가면 들킴
 *  - 미션: { "mission": { "targets": [이벤트 이름...], "time": 60, "label": "...", "success": [], "fail": [] } }
 *    제한 시간 안에 대상에게 모두 말을 걸면(결정키) 성공
 *  - 타이밍: { "timing": { "goal": 10, "maxMiss": 3, "speed": 1.6, "zone": 0.22, "label": "등사기 인쇄",
 *    "per": 100, "unit": "장", "success": [], "fail": [] } }
 *  - 퀴즈 힌트: 데이터 "hintQuizzes": [{ "question": "...", "choice": [...], "answer": 1 }]
 *    힌트를 다 쓰면 퀴즈를 맞혀 힌트 1개를 더 얻음
 *  - 따라오는 사람들: 조사 지점에 "follow": 조건  → 조건이 맞으면 주인공을 따라 걸음
 *  - 화면 색(밤): 방에 "tint": [-68,-68,0,68]  /  단계 { "tint": [...], "duration": 60 }
 *  - 사료 수집: 데이터 "archives": [아이템 id...] → 기록 화면에 모은 개수 표시
 */

var Imported = Imported || {};
Imported.EscapeRoom = '3.4.0';

var $dataEscape = null;
var EscapeManager = null;

(function() {
    'use strict';

    var params = PluginManager.parameters('EscapeRoom');
    var DATA_FILE = String(params['DataFile'] || 'EscapeData.json');
    var WALL_REGION = Number(params['WallRegion'] || 1);
    var SHOW_DEBUG = String(params['ShowDebug']) === 'true';
    var SE_DOOR = params['SeDoor'] === undefined ? 'Open1' : String(params['SeDoor']);
    var SE_SOLVE = params['SeSolve'] === undefined ? 'Chime2' : String(params['SeSolve']);
    var SE_ITEM = params['SeItem'] === undefined ? 'Item3' : String(params['SeItem']);
    var SE_GATE = params['SeGate'] === undefined ? 'Teleport' : String(params['SeGate']);
    var SE_WARP = params['SeWarp'] === undefined ? 'Move1' : String(params['SeWarp']);

    var SEA_REGION = Number(params['SeaRegion'] || 2);
    var DOCK_REGION = Number(params['DockRegion'] || 3);
    var AUTO_WIDTH = String(params['AutoWidth']) !== 'false';
    var FULLSCREEN = String(params['Fullscreen']) !== 'false';
    var FULL_BUTTON = String(params['FullscreenButton']) !== 'false';
    var MAX_WIDTH = Math.max(816, Number(params['MaxWidth'] || 1392));
    var BASE_W = 816, BASE_H = 624;

    var HUD_H = 40;
    var MSG_LINES = 3;

    //=========================================================================
    // 화면 비율 자동 맞춤
    //=========================================================================
    function escTargetWidth() {
        var w = window.innerWidth || BASE_W, h = window.innerHeight || BASE_H;
        var t = Math.round(BASE_H * (w / h) / 2) * 2;
        return Math.max(BASE_W, Math.min(MAX_WIDTH, t));
    }

    // 휴대폰에서 실제 화면 크기를 재도록 viewport 설정 (MV 기본 index.html은 980px 가상 화면)
    if (AUTO_WIDTH) {
        try {
            var vm = document.querySelector('meta[name="viewport"]');
            if (!vm) { vm = document.createElement('meta'); vm.name = 'viewport'; document.head.appendChild(vm); }
            vm.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
        } catch (e) {}
    }

    // 자동 맞춤일 때는 컴퓨터 브라우저에서도 창 크기에 맞춰 확대/축소 (MV 기본은 휴대폰·NW.js만)
    if (AUTO_WIDTH) {
        Graphics._defaultStretchMode = function() { return true; };
    }

    var _SceneManager_initGraphics = SceneManager.initGraphics;
    SceneManager.initGraphics = function() {
        if (AUTO_WIDTH) {
            var tw = escTargetWidth();
            this._screenWidth = this._boxWidth = tw;
            this._screenHeight = this._boxHeight = BASE_H;
        }
        _SceneManager_initGraphics.call(this);
    };

    // 실행 중에 화면을 돌리거나 창 크기가 바뀌면: 안전한 순간에 다시 맞춤
    var escResize = { pending: 0, timer: null };
    function escApplyWidth(tw) {
        SceneManager._screenWidth = SceneManager._boxWidth = tw;
        Graphics.boxWidth = tw;
        Graphics.width = tw;
        escResize.pending = 0;
    }
    if (AUTO_WIDTH) {
        window.addEventListener('resize', function() {
            clearTimeout(escResize.timer);
            escResize.timer = setTimeout(function() {
                if (!Graphics._renderer) return;
                var tw = escTargetWidth();
                escResize.pending = Math.abs(tw - Graphics.width) >= 16 ? tw : 0;
            }, 150);
        });
    }

    // 새 장면(지도)을 만들기 직전에 바뀐 화면 크기를 바로 반영 (전체 화면 전환 직후 등)
    var _Scene_Map_createDisplayObjects_w = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        if (AUTO_WIDTH && escResize.pending) {
            escApplyWidth(escResize.pending);
            if ($gamePlayer) $gamePlayer.center($gamePlayer.x, $gamePlayer.y);
        }
        _Scene_Map_createDisplayObjects_w.call(this);
    };

    //=========================================================================
    // 시작할 때 전체 화면 (브라우저는 사용자가 누른 순간에만 허락하므로 그 순간에 요청)
    //=========================================================================
    function escCanFullscreen(forButton) {
        if ((!FULLSCREEN && !forButton) || Utils.isNwjs()) return false;
        var el = document.documentElement;
        return !!(el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen);
    }
    function escIsFullscreen() {
        return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    }
    function escExitFullscreen() {
        try {
            var r = document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.msExitFullscreen && document.msExitFullscreen();
            if (r && r.catch) r.catch(function() {});
        } catch (e) {}
    }
    function escToggleFullscreen() {
        if (escIsFullscreen()) escExitFullscreen(); else escRequestFullscreen(true);
    }
    ['fullscreenchange', 'webkitfullscreenchange'].forEach(function(n) {
        document.addEventListener(n, function() {
            var sc = SceneManager._scene;
            if (sc && sc.escRefreshHud) sc.escRefreshHud();
        });
    });
    function escRequestFullscreen(forButton) {
        if (!escCanFullscreen(forButton) || escIsFullscreen()) return;
        var el = document.documentElement;
        try {
            var r = el.requestFullscreen ? el.requestFullscreen({ navigationUI: 'hide' }) :
                    el.webkitRequestFullscreen ? el.webkitRequestFullscreen() : el.msRequestFullscreen();
            if (r && r.catch) r.catch(function() {});
        } catch (e) {}
    }
    var escFsArmed = null;
    function escArmFullscreen() {
        if (!escCanFullscreen() || escFsArmed) return;
        escFsArmed = function(ev) {
            if (ev.type === 'keydown' && ['Enter', ' ', 'Spacebar', 'z', 'Z'].indexOf(ev.key) < 0) return;
            escDisarmFullscreen();
            escRequestFullscreen();
        };
        ['mousedown', 'touchend', 'keydown'].forEach(function(n) { document.addEventListener(n, escFsArmed, true); });
    }
    function escDisarmFullscreen() {
        if (!escFsArmed) return;
        var f = escFsArmed; escFsArmed = null;
        ['mousedown', 'touchend', 'keydown'].forEach(function(n) { document.removeEventListener(n, f, true); });
    }

    var _Scene_Title_update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_Title_update.call(this);
        if (escResize.pending && this.isActive() && !SceneManager.isSceneChanging()) {
            escApplyWidth(escResize.pending);
            SceneManager.goto(Scene_Title);
        }
    };

    function escMapResizeSafe(scene) {
        var M = EscapeManager;
        if (!scene.isActive() || SceneManager.isSceneChanging()) return false;
        if ($gamePlayer.isMoving() || $gamePlayer.isTransferring() || $gameMap.isEventRunning()) return false;
        if (!M || !M.isActive()) return true;
        return M._phase === 'play' && M.canInteract() && !M._bagOpen;
    }

    // 지도 가운데 고정 (지도가 화면보다 넓으면 양옆이 똑같이 잘려 보임)
    function escCenteredMap() {
        if (!$dataMap) return false;
        if (EscapeManager && EscapeManager.isActive && EscapeManager.isActive()) {
            var room = EscapeManager.currentRoom && EscapeManager.currentRoom();
            if (room && room.camera === 'follow') return false;
        }
        return /<escCenter>/i.test($dataMap.note || '') || (EscapeManager && EscapeManager.isActive && EscapeManager.isActive());
    }
    // 지도가 화면보다 좁으면(예: 예전 17칸 지도) 가운데에 두고 양옆은 검게 가립니다.
    // (원경 그림이 옆으로 반복되어 방이 여러 개처럼 보이는 것을 막음)
    Game_Map.prototype.escCenterView = function() {
        var dx = (this.width() - this.screenTileX()) / 2;
        var dy = (this.height() - this.screenTileY()) / 2;
        this._displayX = dx;
        this._displayY = dy;
        this._parallaxX = dx;
        this._parallaxY = dy;
    };

    var _Spriteset_Map_createParallax = Spriteset_Map.prototype.createParallax;
    Spriteset_Map.prototype.createParallax = function() {
        _Spriteset_Map_createParallax.call(this);
        this._escBars = new PIXI.Graphics();
        this._escBarsKey = '';
        this._baseSprite.addChild(this._escBars);
    };

    var _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.call(this);
        this.escUpdateBars();
    };

    Spriteset_Map.prototype.escUpdateBars = function() {
        var g = this._escBars;
        if (!g) return;
        var tw = $gameMap.tileWidth(), th = $gameMap.tileHeight();
        var left = Math.round(-$gameMap.displayX() * tw);          // 지도 왼쪽 끝의 화면 x
        var right = left + $gameMap.width() * tw;
        var top = Math.round(-$gameMap.displayY() * th);
        var bottom = top + $gameMap.height() * th;
        var W = Graphics.width, H = Graphics.height;
        var key = [left, right, top, bottom, W, H].join(',');
        if (key === this._escBarsKey) return;
        this._escBarsKey = key;
        g.clear();
        if ($gameMap.isLoopHorizontal() || $gameMap.isLoopVertical()) return;
        g.beginFill(0x000000, 1);
        if (left > 0) g.drawRect(0, 0, left, H);
        if (right < W) g.drawRect(right, 0, W - right, H);
        if (top > 0) g.drawRect(0, 0, W, top);
        if (bottom < H) g.drawRect(0, bottom, W, H - bottom);
        g.endFill();
    };
    var _Game_Player_center = Game_Player.prototype.center;
    Game_Player.prototype.center = function(x, y) {
        if (escCenteredMap()) return $gameMap.escCenterView();
        return _Game_Player_center.call(this, x, y);
    };
    var _Game_Player_updateScroll = Game_Player.prototype.updateScroll;
    Game_Player.prototype.updateScroll = function(lastX, lastY) {
        if (escCenteredMap()) return $gameMap.escCenterView();
        _Game_Player_updateScroll.call(this, lastX, lastY);
    };

    function SW() { return Graphics.boxWidth; }
    function SH() { return Graphics.boxHeight; }

    //=========================================================================
    // 데이터 파일 불러오기
    //=========================================================================
    var _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        _DataManager_loadDatabase.call(this);
        loadEscapeData();
    };

    function loadEscapeData() {
        $dataEscape = null;
        var url = 'data/' + DATA_FILE;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function() {
            if (xhr.status >= 400) {
                $dataEscape = { __error: '데이터 파일을 찾을 수 없습니다: ' + url };
                return;
            }
            try {
                $dataEscape = JSON.parse(xhr.responseText);
            } catch (e) {
                $dataEscape = { __error: '데이터 파일에 문법 오류가 있습니다.\n' + e.message +
                    '\n쉼표(,), 따옴표("), 괄호를 확인해 주세요.' };
            }
        };
        xhr.onerror = function() {
            $dataEscape = { __error: '데이터 파일을 찾을 수 없습니다: ' + url };
        };
        xhr.send();
    }

    // 음악·영상·타이틀 그림이 실제로 있는지 미리 확인 (없으면 그 기능만 건너뜀)
    var EscapeAssets = {};
    var _assetState = 'idle';
    var _assetPending = 0;

    // 창 바깥을 톡 눌렀는지 (단서 그림 위를 누른 것은 제외)
    function escTappedOutside(win) {
        if (!TouchInput.isTriggered()) return false;
        var lx = win.canvasToLocalX(TouchInput.x), ly = win.canvasToLocalY(TouchInput.y);
        if (lx >= 0 && ly >= 0 && lx < win.width && ly < win.height) return false;
        if (TouchInput.y < HUD_H) return false;
        var sc = SceneManager._scene, cu = sc && sc._escCloseup;
        if (cu && cu.visible && cu.bitmap && cu.bitmap.width) {
            var w = cu.bitmap.width * cu.scale.x, h = cu.bitmap.height * cu.scale.y;
            if (Math.abs(TouchInput.x - cu.x) < w / 2 && Math.abs(TouchInput.y - cu.y) < h / 2) return false;
        }
        return true;
    }

    // 건너뛴 영상이 MV의 재시도 타이머로 다시 시작되지 않도록
    var _Graphics_playVideoInner = Graphics._playVideo;
    Graphics._playVideo = function(src) {
        if (this._escVideoCancelled) return;
        _Graphics_playVideoInner.call(this, src);
    };

    function videoExt() {
        return Game_Interpreter.prototype.videoFileExt.call(null);
    }

    function assetUrl(key) {
        var i = key.indexOf('/');
        var kind = key.substring(0, i);
        var name = key.substring(i + 1);
        var url;
        if (kind === 'bgm') {
            url = AudioManager._path + 'bgm/' + encodeURIComponent(name) + AudioManager.audioFileExt();
            if (Decrypter.hasEncryptedAudio) url = Decrypter.extToEncryptExt(url);
        } else if (kind === 'title') {
            url = 'img/titles1/' + encodeURIComponent(name) + '.png';
            if (Decrypter.hasEncryptedImages) url = Decrypter.extToEncryptExt(url);
        } else if (kind === 'pic') {
            url = 'img/pictures/' + encodeURIComponent(name) + '.png';
            if (Decrypter.hasEncryptedImages) url = Decrypter.extToEncryptExt(url);
        } else {
            url = 'movies/' + encodeURIComponent(name) + videoExt();
        }
        return url;
    }

    function collectAssets(d) {
        var keys = {};
        var addBgm = function(n) { if (n) keys['bgm/' + n] = true; };
        if (d.titleImage) keys['title/' + d.titleImage] = true;
        addBgm(d.titleBgm); addBgm(d.bgm); addBgm(d.endingBgm);
        var scan = function(steps) {
            toArray(steps).forEach(function(st) {
                if (!st || typeof st !== 'object') return;
                if (st.bgm) addBgm(st.bgm);
                if (st.movie) keys['movie/' + st.movie] = true;
                Object.keys(st).forEach(function(k) {
                    if (k === 'success' || k === 'fail' || k === 'cancel' || /^on\d+$/.test(k)) scan(st[k]);
                });
            });
        };
        scan(d.intro);
        // 그림(확대 그림·아이템 그림): 없으면 멈추지 않고 건너뛰기
        var deep = function(o) {
            if (!o || typeof o !== 'object') return;
            if (Array.isArray(o)) { o.forEach(deep); return; }
            Object.keys(o).forEach(function(k) {
                var v = o[k];
                if ((k === 'picture' || k === 'closeup') && typeof v === 'string' && v) keys['pic/' + v] = true;
                else deep(v);
            });
        };
        deep(d.intro); deep(d.rooms); deep(d.review); deep(d.ending);
        Object.keys(d.items || {}).forEach(function(id) {
            var it = d.items[id] || {};
            if (it.image) keys['pic/' + it.image] = true;
            if (it.closeup) keys['pic/' + it.closeup] = true;
        });
        toArray(d.rooms).forEach(function(r) {
            addBgm(r.bgm);
            scan(r.enter);
            toArray(r.hotspots).forEach(function(h) {
                scan(h.steps);
                toArray(h.cases).forEach(function(c) { scan(c.steps); });
            });
        });
        return Object.keys(keys);
    }

    function startAssetCheck() {
        _assetState = 'checking';
        var d = $dataEscape;
        var keys = (d && !d.__error) ? collectAssets(d) : [];
        _assetPending = keys.length;
        if (_assetPending === 0) _assetState = 'done';
        keys.forEach(function(key) {
            var done = function(ok) {
                if (EscapeAssets[key] !== undefined) return;
                EscapeAssets[key] = ok;
                if (!ok) console.warn('EscapeRoom: 파일이 없어 건너뜁니다 → ' + assetUrl(key));
                _assetPending--;
                if (_assetPending <= 0) _assetState = 'done';
            };
            try {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', assetUrl(key));
                xhr.responseType = 'arraybuffer';
                xhr.onload = function() {
                    done(xhr.status < 400 && !!xhr.response && xhr.response.byteLength > 0);
                };
                xhr.onerror = function() { done(false); };
                xhr.send();
            } catch (e) {
                done(false);
            }
        });
    }

    var _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!_DataManager_isDatabaseLoaded.call(this) || !$dataEscape) return false;
        if (_assetState === 'idle') startAssetCheck();
        return _assetState === 'done';
    };

    function hasAsset(kind, name) {
        return !!name && EscapeAssets[kind + '/' + name] === true;
    }

    // 없는 그림을 불러도 '불러오기 오류'로 멈추지 않게 빈 그림으로 바꿔 줌
    var _ImageManager_loadPicture = ImageManager.loadPicture;
    ImageManager.loadPicture = function(filename, hue) {
        if (filename && EscapeAssets['pic/' + filename] === false) return new Bitmap(1, 1);
        return _ImageManager_loadPicture.call(this, filename, hue);
    };

    //=========================================================================
    // 타이틀 화면: 그림 · 게임 이름 · 음악
    //=========================================================================
    function escData() {
        return $dataEscape && !$dataEscape.__error ? $dataEscape : null;
    }

    var _Scene_Title_createBackground = Scene_Title.prototype.createBackground;
    Scene_Title.prototype.createBackground = function() {
        var d = escData();
        if (d && hasAsset('title', d.titleImage)) {
            var bmp = ImageManager.loadTitle1(d.titleImage);
            this._backSprite1 = new Sprite(bmp);
            this._backSprite1.anchor.x = 0.5;
            this._backSprite1.anchor.y = 0.5;
            this._backSprite1.x = Graphics.width / 2;
            this._backSprite1.y = Graphics.height / 2;
            var spr = this._backSprite1;
            bmp.addLoadListener(function() {
                var sc = Math.max(1, Graphics.width / bmp.width, Graphics.height / bmp.height);
                spr.scale.x = spr.scale.y = sc;
            });
            this._backSprite2 = new Sprite();
            this.addChild(this._backSprite1);
            this.addChild(this._backSprite2);
            this._escTitleImage = true;
        } else {
            _Scene_Title_createBackground.call(this);
        }
    };

    var _Scene_Title_drawGameTitle = Scene_Title.prototype.drawGameTitle;
    Scene_Title.prototype.drawGameTitle = function() {
        var d = escData();
        if (this._escTitleImage && d && d.titleText === false) return;
        if (d && d.gameTitle) {
            var b = this._gameTitleSprite.bitmap;
            b.outlineColor = 'rgba(40,22,10,1)';
            b.outlineWidth = 8;
            b.fontSize = 64;
            b.textColor = '#ffe8a0';
            b.drawText(d.gameTitle, 20, Graphics.height / 4, Graphics.width - 40, 64, 'center');
            return;
        }
        _Scene_Title_drawGameTitle.call(this);
    };

    var _Scene_Title_playTitleMusic = Scene_Title.prototype.playTitleMusic;
    Scene_Title.prototype.playTitleMusic = function() {
        var d = escData();
        if (d && hasAsset('bgm', d.titleBgm)) {
            AudioManager.playBgm({ name: d.titleBgm, volume: 90, pitch: 100, pan: 0 });
            AudioManager.stopBgs();
            AudioManager.stopMe();
            return;
        }
        _Scene_Title_playTitleMusic.call(this);
    };

    var _Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _Scene_Title_start.call(this);
        var d = escData();
        if (d && d.gameTitle) document.title = d.gameTitle;
        if (d) escArmFullscreen();
    };

    // 타이틀: 새 게임/계속/옵션 메뉴 대신 "화면을 클릭하세요" 안내 → 누르면 바로 시작
    var _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.call(this);
        if (!escData()) return;
        this._commandWindow.visible = false;
        this._commandWindow.deactivate();
        this._escPressFrames = 0;
        var touch = Utils.isMobileDevice() || ('ontouchstart' in window) || (navigator.maxTouchPoints > 1);
        var text = touch ? '게임을 시작하려면 화면을 터치하세요' : '게임을 시작하려면 화면을 클릭하세요';
        var bw = 520, bh = 56;
        var bmp = new Bitmap(bw, bh);
        roundRect(bmp, 2, 2, bw - 4, bh - 4, 26, 'rgba(12,10,20,0.62)', 'rgba(255,226,150,0.85)', 2);
        bmp.fontSize = 26;
        bmp.textColor = '#ffe9b0';
        bmp.outlineColor = 'rgba(0,0,0,0.7)';
        bmp.outlineWidth = 4;
        bmp.drawText(text, 0, 0, bw, bh, 'center');
        var sp = new Sprite(bmp);
        sp.anchor.x = 0.5;
        sp.anchor.y = 0.5;
        sp.x = Graphics.width / 2;
        sp.y = Math.round(Graphics.height * Number(escData().titlePromptY || 0.74));
        this._escPress = sp;
        this.addChild(sp);
    };

    var _Scene_Title_updateTitlePress = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        if (this._escPress) {
            this._commandWindow.visible = false;
            this._commandWindow.deactivate();
            this._commandWindow.openness = 0;
        }
        _Scene_Title_updateTitlePress.call(this);
        if (!this._escPress) return;
        this._escPressFrames++;
        this._escPress.opacity = 150 + Math.round(105 * Math.abs(Math.sin(this._escPressFrames / 28)));
        if (this._escStarting || !this.isActive() || this.isBusy() || SceneManager.isSceneChanging()) return;
        if (this._escPressFrames > 15 && (Input.isTriggered('ok') || TouchInput.isTriggered())) {
            this._escStarting = true;
            this._escPress.visible = false;
            SoundManager.playOk();
            this.commandNewGame();
        }
    };

    // 대시(Shift, 클릭 이동 시 자동 달리기) 끄기
    var _Game_Player_updateDashing = Game_Player.prototype.updateDashing;
    Game_Player.prototype.updateDashing = function() {
        if (EscapeManager && EscapeManager.isActive && EscapeManager.isActive()) {
            this._dashing = false;
            return;
        }
        _Game_Player_updateDashing.call(this);
    };

    //=========================================================================
    // 도움 함수
    //=========================================================================
    function toArray(v) {
        if (v === undefined || v === null) return [];
        return Array.isArray(v) ? v : [v];
    }

    // 외부 링크 열기 (설치형: 기본 브라우저 / 웹: 새 탭)
    function openExternal(url) {
        try {
            if (Utils.isNwjs()) {
                var shell = (typeof nw !== 'undefined' && nw.Shell) ? nw.Shell : require('nw.gui').Shell;
                shell.openExternal(url);
                return true;
            }
            var w = window.open(url, '_blank');
            if (w) {
                try { w.opener = null; } catch (e) {}
                return true;
            }
        } catch (e) {
            console.warn('EscapeRoom: 링크를 열지 못했습니다 → ' + url);
        }
        return false;
    }

    // 안전한 효과음: 파일이 없어도 게임이 멈추지 않고 조용히 넘어갑니다.
    var _seCache = {};
    function playSafeSe(name, volume, pitch) {
        if (!name) return false;
        var ctx = WebAudio._context;
        if (!ctx) return false;
        var play = function(buffer) {
            try {
                var src = ctx.createBufferSource();
                src.buffer = buffer;
                src.playbackRate.value = (pitch || 100) / 100;
                var g = ctx.createGain();
                g.gain.value = (AudioManager.seVolume / 100) * ((volume || 90) / 100);
                src.connect(g);
                g.connect(WebAudio._masterGainNode || ctx.destination);
                src.start(0);
            } catch (e) {}
        };
        var cached = _seCache[name];
        if (cached === false) return false;
        if (cached && cached !== 'loading') {
            play(cached);
            return true;
        }
        if (cached === 'loading') return true;
        _seCache[name] = 'loading';
        var url = AudioManager._path + 'se/' + encodeURIComponent(name) + AudioManager.audioFileExt();
        if (Decrypter.hasEncryptedAudio) url = Decrypter.extToEncryptExt(url);
        var xhr = new XMLHttpRequest();
        try {
            xhr.open('GET', url);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function() {
                if (xhr.status >= 400 || !xhr.response || !xhr.response.byteLength) {
                    _seCache[name] = false;
                    return;
                }
                try {
                    var arr = xhr.response;
                    if (Decrypter.hasEncryptedAudio) arr = Decrypter.decryptArrayBuffer(arr);
                    ctx.decodeAudioData(arr, function(buffer) {
                        _seCache[name] = buffer;
                        play(buffer);
                    }, function() { _seCache[name] = false; });
                } catch (e) {
                    _seCache[name] = false;
                }
            };
            xhr.onerror = function() { _seCache[name] = false; };
            xhr.send();
        } catch (e) {
            _seCache[name] = false;
        }
        return true;
    }

    // 효과용 그림(코드로 그림)
    var _fxCache = {};
    function fxGlow(size, rgb) {
        var key = 'glow' + size + rgb;
        if (_fxCache[key]) return _fxCache[key];
        var b = new Bitmap(size, size);
        var ctx = b._context || b.context;
        var g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        g.addColorStop(0, 'rgba(' + rgb + ',1)');
        g.addColorStop(0.35, 'rgba(' + rgb + ',0.55)');
        g.addColorStop(1, 'rgba(' + rgb + ',0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);
        setDirty(b);
        _fxCache[key] = b;
        return b;
    }
    function fxSpark(rgb) {
        var key = 'spark' + rgb;
        if (_fxCache[key]) return _fxCache[key];
        var b = new Bitmap(24, 24);
        var ctx = b._context || b.context;
        var g = ctx.createRadialGradient(12, 12, 0, 12, 12, 12);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.3, 'rgba(' + rgb + ',0.8)');
        g.addColorStop(1, 'rgba(' + rgb + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(12, 0); ctx.lineTo(14, 10); ctx.lineTo(24, 12); ctx.lineTo(14, 14);
        ctx.lineTo(12, 24); ctx.lineTo(10, 14); ctx.lineTo(0, 12); ctx.lineTo(10, 10);
        ctx.closePath();
        ctx.fill();
        setDirty(b);
        _fxCache[key] = b;
        return b;
    }
    function fxRays(size) {
        var key = 'rays' + size;
        if (_fxCache[key]) return _fxCache[key];
        var b = new Bitmap(size, size);
        var ctx = b._context || b.context;
        var c = size / 2;
        for (var i = 0; i < 12; i++) {
            var a = i * Math.PI / 6;
            var g = ctx.createRadialGradient(c, c, 0, c, c, c);
            g.addColorStop(0, 'rgba(255,248,210,0.9)');
            g.addColorStop(1, 'rgba(255,248,210,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.moveTo(c, c);
            ctx.lineTo(c + Math.cos(a - 0.09) * c, c + Math.sin(a - 0.09) * c);
            ctx.lineTo(c + Math.cos(a + 0.09) * c, c + Math.sin(a + 0.09) * c);
            ctx.closePath();
            ctx.fill();
        }
        setDirty(b);
        _fxCache[key] = b;
        return b;
    }
    function fxDoorway() {
        if (_fxCache.doorway) return _fxCache.doorway;
        var b = new Bitmap(48, 48);
        var ctx = b._context || b.context;
        var g = ctx.createRadialGradient(24, 24, 2, 24, 24, 30);
        g.addColorStop(0, 'rgba(255,250,220,0.95)');
        g.addColorStop(0.6, 'rgba(255,214,120,0.55)');
        g.addColorStop(1, 'rgba(255,190,90,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 48, 48);
        setDirty(b);
        _fxCache.doorway = b;
        return b;
    }

    function setDirty(bitmap) {
        if (bitmap._setDirty) bitmap._setDirty();
    }

    function ctxOf(bitmap) {
        return bitmap._context || bitmap.context;
    }

    function roundRect(bitmap, x, y, w, h, r, fill, stroke, lineWidth) {
        var ctx = ctxOf(bitmap);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill();
        }
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = lineWidth || 2;
            ctx.stroke();
        }
        ctx.restore();
        setDirty(bitmap);
    }

    // 한글 줄바꿈: 띄어쓰기 단위로 자르고, 너무 긴 단어는 글자 단위로 자릅니다.
    function wrapText(bitmap, text, maxWidth) {
        var result = [];
        String(text).replace(/\\n/g, '\n').split('\n').forEach(function(para) {
            var words = para.split(' ');
            var line = '';
            words.forEach(function(word) {
                var test = line ? line + ' ' + word : word;
                if (bitmap.measureTextWidth(test) <= maxWidth) {
                    line = test;
                    return;
                }
                if (line) result.push(line);
                line = '';
                var chunk = '';
                for (var i = 0; i < word.length; i++) {
                    var t = chunk + word[i];
                    if (bitmap.measureTextWidth(t) > maxWidth && chunk) {
                        result.push(chunk);
                        chunk = word[i];
                    } else {
                        chunk = t;
                    }
                }
                line = chunk;
            });
            result.push(line);
        });
        return result;
    }

    function formatTime(sec) {
        sec = Math.max(0, Math.ceil(sec));
        var m = Math.floor(sec / 60);
        var s = sec % 60;
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    var DIR_NAMES = { down: 2, left: 4, right: 6, up: 8 };
    function toDir(d) {
        if (typeof d === 'string') return DIR_NAMES[d] || 2;
        return Number(d) || 0;
    }

    //=========================================================================
    // Window_EscMessage - 대사창 (글자가 한 글자씩 나타납니다)
    //=========================================================================
    function Window_EscMessage() {
        this.initialize.apply(this, arguments);
    }
    Window_EscMessage.prototype = Object.create(Window_Base.prototype);
    Window_EscMessage.prototype.constructor = Window_EscMessage;

    Window_EscMessage.prototype.initialize = function() {
        var h = this.fittingHeight(MSG_LINES);
        Window_Base.prototype.initialize.call(this, 12, SH() - h - 10, SW() - 24, h);
        this.openness = 0;
        this._pages = [];
        this._callback = null;
        this._waitInput = false;
        this._openFrame = 0;
        this._shown = 0;
        this._total = 0;
        this._nameWindow = null;
    };

    Window_EscMessage.prototype.standardFontSize = function() { return 24; };
    Window_EscMessage.prototype.lineHeight = function() { return 36; };
    Window_EscMessage.prototype.setNameWindow = function(w) { this._nameWindow = w; };

    // 글 속 {이름} 바꾸기: 주인공 고르기 "vars" / 데이터 "vars"
    function escSub(t) {
        if (t === null || t === undefined) return t;
        t = String(t);
        if (t.indexOf('{') < 0 || !EscapeManager) return t;
        var v = EscapeManager._vars || {};
        return t.replace(/\{([^{}]+)\}/g, function(m, k) { return v[k] !== undefined ? String(v[k]) : m; });
    }

    Window_EscMessage.prototype.say = function(text, speaker, callback, waitInput) {
        text = escSub(text); speaker = escSub(speaker);
        this.resetFontSettings();
        var lines = wrapText(this.contents, text, this.contentsWidth() - 12);
        this._pages = [];
        for (var i = 0; i < lines.length; i += MSG_LINES) {
            this._pages.push(lines.slice(i, i + MSG_LINES));
        }
        if (this._pages.length === 0) this._pages.push(['']);
        this._callback = callback || null;
        this._waitInput = waitInput !== false;
        this._openFrame = Graphics.frameCount;
        this.startPage(!this._waitInput);
        this.open();
        if (this._nameWindow) this._nameWindow.setName(speaker || '', this);
    };

    Window_EscMessage.prototype.startPage = function(instant) {
        var page = this._pages[0] || [];
        this._total = page.join('').length;
        this._shown = instant ? this._total : 0;
        this.drawPage();
    };

    Window_EscMessage.prototype.drawPage = function() {
        this.contents.clear();
        this.resetFontSettings();
        var page = this._pages[0] || [];
        var left = this._shown;
        for (var i = 0; i < page.length && left > 0; i++) {
            var part = page[i].substring(0, left);
            left -= page[i].length;
            this.drawText(part, 6, i * this.lineHeight(), this.contentsWidth() - 12);
        }
    };

    Window_EscMessage.prototype.isTyping = function() {
        return this._shown < this._total;
    };

    Window_EscMessage.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (!this.isOpen() || this._pages.length === 0) {
            this.pause = false;
            return;
        }
        if (this.isTyping()) {
            this._shown = Math.min(this._total, this._shown + 2);
            this.drawPage();
        }
        this.pause = this._waitInput && !this.isTyping();
        if (!this._waitInput) return;
        if (Graphics.frameCount === this._openFrame) return;
        if (Input.isTriggered('ok') || Input.isTriggered('cancel') ||
            TouchInput.isTriggered() || TouchInput.isCancelled()) {
            if (this.isTyping()) {
                this._shown = this._total;
                this.drawPage();
                return;
            }
            this._pages.shift();
            if (this._pages.length > 0) {
                this.startPage(false);
            } else {
                this.finish();
            }
        }
    };

    Window_EscMessage.prototype.finish = function() {
        this._pages = [];
        this._waitInput = false;
        this.pause = false;
        this.close();
        if (this._nameWindow) this._nameWindow.setName('', this);
        var cb = this._callback;
        this._callback = null;
        if (cb) cb();
    };

    Window_EscMessage.prototype.dismiss = function() {
        this._pages = [];
        this._waitInput = false;
        this._callback = null;
        this.pause = false;
        this.close();
        if (this._nameWindow) this._nameWindow.setName('', this);
    };

    //=========================================================================
    // Window_EscName - 말하는 사람 이름표
    //=========================================================================
    function Window_EscName() {
        this.initialize.apply(this, arguments);
    }
    Window_EscName.prototype = Object.create(Window_Base.prototype);
    Window_EscName.prototype.constructor = Window_EscName;

    Window_EscName.prototype.initialize = function() {
        Window_Base.prototype.initialize.call(this, 0, 0, 240, this.fittingHeight(1));
        this.openness = 0;
    };

    Window_EscName.prototype.standardFontSize = function() { return 22; };

    Window_EscName.prototype.setName = function(name, msgWindow) {
        if (!name) {
            this.close();
            return;
        }
        this.resetFontSettings();
        var w = Math.min(SW() - 40, Math.max(120, this.contents.measureTextWidth(name) + this.standardPadding() * 2 + 24));
        this.width = w;
        this.createContents();
        this.x = msgWindow.x + 8;
        this.y = msgWindow.y - this.height + 6;
        this.changeTextColor(this.textColor(6));
        this.drawText(name, 0, 0, this.contentsWidth(), 'center');
        this.open();
    };

    //=========================================================================
    // Window_EscChoice - 선택지(퀴즈)
    //=========================================================================
    function Window_EscChoice() {
        this.initialize.apply(this, arguments);
    }
    Window_EscChoice.prototype = Object.create(Window_Command.prototype);
    Window_EscChoice.prototype.constructor = Window_EscChoice;

    Window_EscChoice.prototype.initialize = function() {
        this._options = ['-'];
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.openness = 0;
        this.deactivate();
    };

    Window_EscChoice.prototype.standardFontSize = function() { return 22; };
    Window_EscChoice.prototype.windowWidth = function() { return Math.min(720, SW() - 40); };
    Window_EscChoice.prototype.numVisibleRows = function() { return this._options.length; };

    Window_EscChoice.prototype.makeCommandList = function() {
        var marks = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];
        for (var i = 0; i < this._options.length; i++) {
            this.addCommand((marks[i] || (i + 1) + '.') + ' ' + this._options[i], 'choice' + i);
        }
    };

    Window_EscChoice.prototype.setup = function(options, bottomY) {
        this._options = options.slice(0, 8);
        this.width = this.windowWidth();
        this.height = this.fittingHeight(this._options.length);
        this.x = (SW() - this.width) / 2;
        this.y = Math.max(HUD_H + 4, bottomY - this.height - 44);
        this.refresh();
        this.select(0);
        this.open();
        this.activate();
        this._openFrame = Graphics.frameCount;
    };

    Window_EscChoice.prototype.onTouch = function(triggered) {
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        var hit = this.hitTest(x, y);
        if (hit >= 0) {
            if (hit !== this.index()) {
                this.select(hit);
                SoundManager.playCursor();
            }
            if (triggered) this.processOk();
        }
    };

    //=========================================================================
    // Window_EscNumpad - 숫자 자물쇠
    //=========================================================================
    function Window_EscNumpad() {
        this.initialize.apply(this, arguments);
    }
    Window_EscNumpad.prototype = Object.create(Window_Selectable.prototype);
    Window_EscNumpad.prototype.constructor = Window_EscNumpad;

    var PAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '지우기', '0', '확인'];
    var PAD_TOP = 74;

    Window_EscNumpad.prototype.initialize = function() {
        var w = 380;
        var h = this.standardPadding() * 2 + PAD_TOP + 4 * 52;
        Window_Selectable.prototype.initialize.call(this, (SW() - w) / 2, 0, w, h);
        this._digits = 4;
        this._value = '';
        this.openness = 0;
        this.deactivate();
        this.refresh();
    };

    Window_EscNumpad.prototype.standardFontSize = function() { return 24; };
    Window_EscNumpad.prototype.maxItems = function() { return PAD_KEYS.length; };
    Window_EscNumpad.prototype.maxCols = function() { return 3; };
    Window_EscNumpad.prototype.itemHeight = function() { return 52; };

    Window_EscNumpad.prototype.itemRect = function(index) {
        var rect = Window_Selectable.prototype.itemRect.call(this, index);
        rect.y += PAD_TOP;
        return rect;
    };

    Window_EscNumpad.prototype.setup = function(digits, bottomY) {
        this._digits = Math.max(1, Math.min(8, digits || 4));
        this._value = '';
        this.y = Math.max(HUD_H + 4, bottomY - this.height - 44);
        this.refresh();
        this.select(11);
        this.open();
        this.activate();
        this._openFrame = Graphics.frameCount;
    };

    Window_EscNumpad.prototype.value = function() { return this._value; };
    Window_EscNumpad.prototype.isFull = function() { return this._value.length >= this._digits; };

    Window_EscNumpad.prototype.addDigit = function(d) {
        if (this._value.length < this._digits) {
            this._value += d;
            SoundManager.playCursor();
            this.refresh();
        } else {
            SoundManager.playBuzzer();
        }
    };

    Window_EscNumpad.prototype.backspace = function() {
        if (this._value.length > 0) {
            this._value = this._value.slice(0, -1);
            SoundManager.playCancel();
            this.refresh();
        }
    };

    Window_EscNumpad.prototype.refresh = function() {
        if (!this.contents) return;
        this.contents.clear();
        this.resetFontSettings();
        var box = 40;
        var gap = 8;
        var total = this._digits * box + (this._digits - 1) * gap;
        var sx = (this.contentsWidth() - total) / 2;
        for (var i = 0; i < this._digits; i++) {
            var bx = sx + i * (box + gap);
            roundRect(this.contents, bx, 8, box, 52, 6, 'rgba(0,0,0,0.55)', 'rgba(255,224,160,0.9)', 2);
            this.contents.fontSize = 30;
            this.changeTextColor(this.textColor(0));
            this.contents.drawText(this._value[i] || '', bx, 8, box, 52, 'center');
        }
        this.resetFontSettings();
        this.drawAllItems();
    };

    Window_EscNumpad.prototype.drawItem = function(index) {
        var rect = this.itemRect(index);
        var key = PAD_KEYS[index];
        var fill = key === '확인' ? 'rgba(60,120,70,0.85)' : (key === '지우기' ? 'rgba(120,60,50,0.8)' : 'rgba(255,255,255,0.10)');
        roundRect(this.contents, rect.x + 3, rect.y + 3, rect.width - 6, rect.height - 6, 8, fill, 'rgba(255,255,255,0.25)', 1);
        this.resetFontSettings();
        if (key.length > 1) this.contents.fontSize = 20;
        this.contents.drawText(key, rect.x, rect.y, rect.width, rect.height, 'center');
    };

    Window_EscNumpad.prototype.onTouch = function(triggered) {
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        var hit = this.hitTest(x, y);
        if (hit >= 0 && triggered) {
            this.select(hit);
            this.processOk();
        }
    };

    Window_EscNumpad.prototype.processOk = function() {
        var key = PAD_KEYS[this.index()];
        if (key === '지우기') {
            this.backspace();
        } else if (key === '확인') {
            this.updateInputData();
            this.callHandler('submit');
        } else if (key) {
            this.addDigit(key);
        }
    };

    //=========================================================================
    // Window_EscTiming - 타이밍 미니게임 (움직이는 바늘이 초록 칸에 왔을 때 누르기)
    //=========================================================================
    function Window_EscTiming() {
        this.initialize.apply(this, arguments);
    }
    Window_EscTiming.prototype = Object.create(Window_Base.prototype);
    Window_EscTiming.prototype.constructor = Window_EscTiming;
    Window_EscTiming.prototype.initialize = function() {
        var w = Math.min(600, SW() - 40), h = 228;
        Window_Base.prototype.initialize.call(this, (SW() - w) / 2, HUD_H + 70, w, h);
        this.openness = 0;
        this.active = false;
        this._handlers = {};
    };
    Window_EscTiming.prototype.setHandler = function(n, f) { this._handlers[n] = f; };
    Window_EscTiming.prototype.setup = function(def) {
        this._def = def;
        this._goal = Number(def.goal || 10);
        this._maxMiss = Number(def.maxMiss || 3);
        this._speed = Number(def.speed || 1.5);
        this._zoneW = Number(def.zone || 0.22);
        this._ok = 0; this._miss = 0; this._t = 0; this._pos = 0; this._dir = 1;
        this._flash = 0; this._flashOk = true; this._end = 0;
        this.newZone();
        this.open(); this.activate();
        this._openFrame = Graphics.frameCount;
        this.refresh();
    };
    Window_EscTiming.prototype.newZone = function() {
        this._zone = 0.08 + Math.random() * (0.84 - this._zoneW);
    };
    Window_EscTiming.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (!this.active || !this.isOpen()) return;
        if (this._end > 0) {
            if (--this._end === 0) { var ok = this._ok >= this._goal; this.active = false; if (this._handlers.done) this._handlers.done(ok); }
            this.refresh();
            return;
        }
        this._pos += this._dir * this._speed / 90;
        if (this._pos > 1) { this._pos = 1; this._dir = -1; }
        if (this._pos < 0) { this._pos = 0; this._dir = 1; }
        if (this._flash > 0) this._flash--;
        if (this._openFrame !== Graphics.frameCount && Graphics.frameCount - this._openFrame > 8 &&
            (Input.isTriggered('ok') || TouchInput.isTriggered())) {
            var hit = this._pos >= this._zone && this._pos <= this._zone + this._zoneW;
            this._flash = 18; this._flashOk = hit;
            if (hit) {
                this._ok++;
                if (!playSafeSe(SE_ITEM, 70, 130)) SoundManager.playCursor();
                this.newZone();
                this._speed *= 1.04;
            } else {
                this._miss++;
                SoundManager.playBuzzer();
                $gameScreen.startShake(4, 10, 12);
            }
            if (this._ok >= this._goal || this._miss > this._maxMiss) this._end = 40;
        }
        this.refresh();
    };
    Window_EscTiming.prototype.refresh = function() {
        var c = this.contents; if (!c) return;
        c.clear();
        var w = this.contentsWidth(), def = this._def || {};
        c.fontSize = 22; this.changeTextColor('#ffe9b0');
        c.drawText(def.label || '타이밍', 0, 0, w, 32, 'center');
        c.fontSize = 18; this.resetTextColor();
        var per = Number(def.per || 1), unit = def.unit || '';
        c.drawText('완성: ' + (this._ok * per) + ' / ' + (this._goal * per) + unit, 0, 34, w / 2, 26, 'left');
        // 소리(경계) 막대
        var mx = w / 2 + 10, mw = w / 2 - 10;
        c.drawText('소리', mx, 34, 50, 26, 'left');
        for (var i = 0; i < this._maxMiss + 1; i++) {
            var bx = mx + 52 + i * ((mw - 56) / (this._maxMiss + 1));
            c.fillRect(bx, 40, (mw - 56) / (this._maxMiss + 1) - 6, 16, i < this._miss ? '#ff6650' : 'rgba(255,255,255,0.2)');
        }
        // 막대
        var bx0 = 10, by = 78, bw = w - 20, bh = 40;
        c.fillRect(bx0, by, bw, bh, 'rgba(0,0,0,0.5)');
        c.fillRect(bx0 + bw * this._zone, by, bw * this._zoneW, bh, 'rgba(90,220,120,0.85)');
        var cx = bx0 + bw * this._pos;
        c.fillRect(cx - 3, by - 8, 6, bh + 16, this._flash > 0 ? (this._flashOk ? '#9dffb0' : '#ff6650') : '#ffffff');
        c.fontSize = 18;
        var msg = this._end > 0 ? (this._ok >= this._goal ? '완성!' : '소리가 너무 컸다...') :
                  (this._flash > 0 ? (this._flashOk ? '좋아!' : '덜컹! 소리가 났다') : 'Enter · 클릭 · 톡: 초록 칸에서 누르기');
        this.changeTextColor(this._flash > 0 && !this._flashOk ? '#ff9a8a' : '#ffffff');
        c.drawText(msg, 0, by + bh + 14, w, 28, 'center');
        this.resetTextColor();
    };

    //=========================================================================
    // Window_EscDial - 다이얼 자물쇠 (글자·방향·색깔 등)
    //=========================================================================
    function Window_EscDial() {
        this.initialize.apply(this, arguments);
    }
    Window_EscDial.prototype = Object.create(Window_Base.prototype);
    Window_EscDial.prototype.constructor = Window_EscDial;

    var DIAL_ARROW = 26;
    var DIAL_BOX = 54;
    var DIAL_GAP = 10;
    var DIAL_BTN = 40;

    Window_EscDial.prototype.initialize = function() {
        Window_Base.prototype.initialize.call(this, 0, 0, 300, 200);
        this.openness = 0;
        this._slots = [];
        this._values = [];
        this._labels = [];
        this._cursor = 0;
        this._handlers = {};
        this._openFrame = -1;
        this._slotW = 80;
        this._fontSize = 24;
        this.deactivate();
    };

    Window_EscDial.prototype.setHandler = function(name, fn) { this._handlers[name] = fn; };
    Window_EscDial.prototype.callHandler = function(name) {
        if (this._handlers[name]) this._handlers[name]();
    };

    Window_EscDial.prototype.titleH = function() { return this._title ? 34 : 0; };
    Window_EscDial.prototype.labelH = function() { return this.titleH() + (this._labels.length > 0 ? 28 : 0); };

    Window_EscDial.prototype.setup = function(slots, labels, bottomY, title) {
        this._title = title || '';
        this._slots = slots;
        this._labels = labels || [];
        this._values = slots.map(function() { return 0; });
        this._cursor = 0;
        var n = slots.length;
        var probe = this.contents;
        var widest = 0;
        this._fontSize = 24;
        var measure = function(fs) {
            probe.fontSize = fs;
            var w = 0;
            slots.forEach(function(list, i) {
                list.forEach(function(sym) { w = Math.max(w, probe.measureTextWidth(String(sym))); });
            });
            return w;
        };
        var labelW = 0;
        probe.fontSize = 16;
        this._labels.forEach(function(l) { labelW = Math.max(labelW, probe.measureTextWidth(String(l))); });
        var pad = this.standardPadding();
        var maxW = SW() - 24;
        for (var fs = 24; fs >= 16; fs -= 2) {
            widest = measure(fs);
            this._fontSize = fs;
            this._slotW = Math.max(64, widest + 26, Math.min(labelW + 10, 170));
            if (n * this._slotW + (n - 1) * DIAL_GAP + pad * 2 <= maxW) break;
        }
        var minW = 300;
        if (this._title) {
            probe.fontSize = 18;
            minW = Math.max(minW, Math.min(maxW, probe.measureTextWidth(this._title) + pad * 2 + 16));
        }
        this.width = Math.min(maxW, Math.max(minW, n * this._slotW + (n - 1) * DIAL_GAP + pad * 2));
        this.height = pad * 2 + this.labelH() + DIAL_ARROW * 2 + DIAL_BOX + 12 + DIAL_BTN;
        this.x = (SW() - this.width) / 2;
        this.y = Math.max(HUD_H + 4, bottomY - this.height - 44);
        this.createContents();
        this.refresh();
        this.open();
        this.activate();
        this._openFrame = Graphics.frameCount;
    };

    Window_EscDial.prototype.values = function() {
        var self = this;
        return this._slots.map(function(list, i) { return String(list[self._values[i]]); });
    };

    Window_EscDial.prototype.slotX = function(i) {
        var n = this._slots.length;
        var total = n * this._slotW + (n - 1) * DIAL_GAP;
        return (this.contentsWidth() - total) / 2 + i * (this._slotW + DIAL_GAP);
    };

    Window_EscDial.prototype.btnRect = function() {
        var w = 140;
        var y = this.labelH() + DIAL_ARROW * 2 + DIAL_BOX + 12;
        return { x: (this.contentsWidth() - w) / 2, y: y, w: w, h: DIAL_BTN - 4 };
    };

    Window_EscDial.prototype.refresh = function() {
        var b = this.contents;
        b.clear();
        var n = this._slots.length;
        var top = this.labelH();
        if (this._title) {
            b.fontSize = 18;
            b.textColor = '#ffe9b0';
            b.drawText(this._title, 0, 0, this.contentsWidth(), 28, 'center');
        }
        for (var i = 0; i < n; i++) {
            var x = this.slotX(i);
            var sel = this._cursor === i;
            if (this._labels[i]) {
                b.fontSize = 16;
                b.textColor = this.systemColor();
                b.drawText(String(this._labels[i]), x - 6, this.titleH(), this._slotW + 12, 26, 'center');
            }
            var cx = x + this._slotW / 2;
            this.drawTriangle(cx, top + 4, true, sel);
            roundRect(b, x, top + DIAL_ARROW, this._slotW, DIAL_BOX, 8,
                'rgba(0,0,0,0.55)', sel ? 'rgba(255,214,120,1)' : 'rgba(255,224,160,0.55)', sel ? 3 : 2);
            b.fontSize = this._fontSize;
            b.textColor = '#ffffff';
            b.drawText(String(this._slots[i][this._values[i]]), x, top + DIAL_ARROW, this._slotW, DIAL_BOX, 'center');
            this.drawTriangle(cx, top + DIAL_ARROW + DIAL_BOX + 4, false, sel);
        }
        var r = this.btnRect();
        var on = this._cursor === n;
        roundRect(b, r.x, r.y, r.w, r.h, 8, on ? 'rgba(70,140,80,0.95)' : 'rgba(60,110,70,0.75)',
            on ? 'rgba(255,214,120,1)' : 'rgba(255,255,255,0.35)', on ? 3 : 1);
        b.fontSize = 20;
        b.textColor = '#ffffff';
        b.drawText('확인', r.x, r.y, r.w, r.h, 'center');
    };

    Window_EscDial.prototype.drawTriangle = function(cx, y, up, sel) {
        var ctx = ctxOf(this.contents);
        ctx.save();
        ctx.fillStyle = sel ? 'rgba(255,214,120,1)' : 'rgba(255,255,255,0.55)';
        ctx.beginPath();
        if (up) {
            ctx.moveTo(cx, y);
            ctx.lineTo(cx - 11, y + 16);
            ctx.lineTo(cx + 11, y + 16);
        } else {
            ctx.moveTo(cx, y + 16);
            ctx.lineTo(cx - 11, y);
            ctx.lineTo(cx + 11, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        setDirty(this.contents);
    };

    Window_EscDial.prototype.turn = function(i, delta) {
        var len = this._slots[i].length;
        this._values[i] = (this._values[i] + delta + len) % len;
        SoundManager.playCursor();
        this.refresh();
    };

    Window_EscDial.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (!this.active || !this.isOpen() || this._openFrame === Graphics.frameCount) return;
        var n = this._slots.length;
        if (Input.isRepeated('left')) {
            this._cursor = (this._cursor + n) % (n + 1);
            SoundManager.playCursor();
            this.refresh();
        } else if (Input.isRepeated('right')) {
            this._cursor = (this._cursor + 1) % (n + 1);
            SoundManager.playCursor();
            this.refresh();
        } else if (Input.isRepeated('up') && this._cursor < n) {
            this.turn(this._cursor, 1);
        } else if (Input.isRepeated('down') && this._cursor < n) {
            this.turn(this._cursor, -1);
        } else if (Input.isTriggered('ok')) {
            if (this._cursor === n) {
                this.callHandler('submit');
            } else {
                this._cursor++;
                SoundManager.playCursor();
                this.refresh();
            }
        } else if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
            SoundManager.playCancel();
            this.callHandler('cancel');
        } else if (escTappedOutside(this)) {
            SoundManager.playCancel();
            this.callHandler('cancel');
        } else if (TouchInput.isTriggered()) {
            this.onClick(this.canvasToLocalX(TouchInput.x) - this.padding, this.canvasToLocalY(TouchInput.y) - this.padding);
        }
    };

    Window_EscDial.prototype.onClick = function(x, y) {
        var top = this.labelH();
        var r = this.btnRect();
        if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) {
            this._cursor = this._slots.length;
            this.refresh();
            this.callHandler('submit');
            return;
        }
        for (var i = 0; i < this._slots.length; i++) {
            var sx = this.slotX(i);
            if (x < sx - 4 || x >= sx + this._slotW + 4) continue;
            this._cursor = i;
            if (y >= top - 4 && y < top + DIAL_ARROW) {
                this.turn(i, 1);
            } else if (y >= top + DIAL_ARROW && y < top + DIAL_ARROW + DIAL_BOX) {
                this.turn(i, 1);
            } else if (y >= top + DIAL_ARROW + DIAL_BOX && y < top + DIAL_ARROW * 2 + DIAL_BOX + 4) {
                this.turn(i, -1);
            } else {
                this.refresh();
            }
            return;
        }
    };

    //=========================================================================
    // Window_EscBag - 가방 (힌트 + 모은 물건)
    //=========================================================================
    function Window_EscBag() {
        this.initialize.apply(this, arguments);
    }
    Window_EscBag.prototype = Object.create(Window_Selectable.prototype);
    Window_EscBag.prototype.constructor = Window_EscBag;

    Window_EscBag.prototype.initialize = function() {
        var w = 460;
        this._rows = [];
        this._icons = {};
        Window_Selectable.prototype.initialize.call(this, (SW() - w) / 2, 0, w, this.fittingHeight(2));
        this.openness = 0;
        this.deactivate();
    };

    Window_EscBag.prototype.standardFontSize = function() { return 22; };
    Window_EscBag.prototype.itemHeight = function() { return 52; };
    Window_EscBag.prototype.maxItems = function() { return this._rows.length; };
    Window_EscBag.prototype.titleHeight = function() { return 40; };

    Window_EscBag.prototype.itemRect = function(index) {
        var rect = Window_Selectable.prototype.itemRect.call(this, index);
        rect.y += this.titleHeight();
        return rect;
    };

    Window_EscBag.prototype.setup = function(rows, index) {
        this._rows = rows;
        var visible = Math.min(rows.length, 7);
        this.height = this.standardPadding() * 2 + this.titleHeight() + visible * this.itemHeight();
        this.y = Math.max(HUD_H + 6, (SH() - this.height) / 2 - 20);
        this.createContents();
        this.refresh();
        this.select(Math.min(index || 0, rows.length - 1));
        this.open();
        this.activate();
        this._openFrame = Graphics.frameCount;
    };

    Window_EscBag.prototype.currentRow = function() { return this._rows[this.index()]; };

    Window_EscBag.prototype.isCurrentItemEnabled = function() {
        var r = this.currentRow();
        return !!r && r.enabled !== false;
    };

    Window_EscBag.prototype.refresh = function() {
        if (!this.contents) return;
        this.contents.clear();
        this.resetFontSettings();
        this.changeTextColor(this.systemColor());
        this.drawText('가방', 0, 0, this.contentsWidth(), 'center');
        this.resetTextColor();
        this.drawAllItems();
    };

    Window_EscBag.prototype.drawItem = function(index) {
        var r = this._rows[index];
        var rect = this.itemRect(index);
        this.resetFontSettings();
        if (r.hint) {
            roundRect(this.contents, rect.x + 2, rect.y + 4, rect.width - 4, rect.height - 8, 8,
                r.enabled === false ? 'rgba(90,90,90,0.5)' : 'rgba(200,150,60,0.55)', null);
        }
        var tx = rect.x + 12;
        if (r.image) {
            var bmp = this._icons[r.image];
            if (!bmp) {
                bmp = ImageManager.loadPicture(r.image);
                this._icons[r.image] = bmp;
                bmp.addLoadListener(this.refresh.bind(this));
            }
            if (bmp.isReady() && bmp.width > 0) {
                var s = Math.min(40 / bmp.width, 40 / bmp.height);
                var dw = Math.floor(bmp.width * s);
                var dh = Math.floor(bmp.height * s);
                this.contents.blt(bmp, 0, 0, bmp.width, bmp.height, rect.x + 8 + (40 - dw) / 2, rect.y + (rect.height - dh) / 2, dw, dh);
            }
            tx = rect.x + 58;
        }
        this.changePaintOpacity(r.enabled !== false);
        this.contents.drawText(r.text, tx, rect.y, rect.width - (tx - rect.x) - 8, rect.height, 'left');
        this.changePaintOpacity(true);
    };

    Window_EscBag.prototype.onTouch = function(triggered) {
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        var hit = this.hitTest(x, y);
        if (hit >= 0) {
            if (hit !== this.index()) {
                this.select(hit);
                SoundManager.playCursor();
            }
            if (triggered && this.isCurrentItemEnabled()) this.processOk();
        }
    };

    // 창이 열린 바로 그 프레임의 입력(ESC, 클릭)으로 다시 닫히지 않도록
    [Window_EscChoice, Window_EscNumpad, Window_EscBag].forEach(function(Klass) {
        var _processHandling = Klass.prototype.processHandling;
        Klass.prototype.processHandling = function() {
            if (this._openFrame === Graphics.frameCount) return;
            _processHandling.call(this);
        };
        var _processTouch = Klass.prototype.processTouch;
        Klass.prototype.processTouch = function() {
            if (this._openFrame === Graphics.frameCount) return;
            if (this.isOpenAndActive() && this.isCancelEnabled() && escTappedOutside(this)) {
                this.processCancel();
                return;
            }
            _processTouch.call(this);
        };
    });

    //=========================================================================
    // EscapeManager - 게임 진행을 관리합니다
    //=========================================================================
    EscapeManager = {
        _scene: null,

        reset: function() {
            this._data = $dataEscape;
            this._flags = {};
            this._items = [];
            this._visited = {};
            this._hintLevel = {};
            this._hintsLeft = Number((this._data && this._data.hints) || 0);
            this._hintsUsed = 0;
            this._timeLeft = Number((this._data && this._data.timeLimit) || 0);
            this._elapsed = 0;
            this._queue = [];
            this._waiting = false;
            this._waitCount = 0;
            this._waitTransfer = false;
            this._afterQueue = null;
            this._bagOpen = false;
            this._bagIndex = 0;
            this._phase = 'new';
            this._lastModalFrame = -1;
            this._boat = false;
            this._pendingBoat = undefined;
            this._chase = null;
            this._chaseMsg = false;
            this._goal = '';
            this._mission = null;
            this._vars = JSON.parse(JSON.stringify((this._data && this._data.vars) || {}));
            this._companionOverride = null;
            this._quizIndex = 0;
            this._caughtCount = 0;
            this._watch = null;
            this._started = true;
        },

        isActive: function() {
            return !!this._started && !!this._data;
        },

        hasError: function() {
            return !this._data || !!this._data.__error || (this._errors && this._errors.length > 0);
        },

        // --- 방과 조사 지점 -------------------------------------------------
        rooms: function() {
            return toArray(this._data && this._data.rooms);
        },

        roomById: function(id) {
            var list = this.rooms();
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === id) return list[i];
            }
            return null;
        },

        roomForMap: function(mapId) {
            var list = this.rooms();
            for (var i = 0; i < list.length; i++) {
                if (Number(list[i].map) === mapId) return list[i];
            }
            return null;
        },

        isRoomMap: function(mapId) {
            return this.isActive() && !this.hasError() && !!this.roomForMap(mapId);
        },

        currentRoom: function() {
            return $gameMap ? this.roomForMap($gameMap.mapId()) : null;
        },

        hotspotById: function(room, id) {
            if (!room || !id) return null;
            var list = toArray(room.hotspots);
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === id) return list[i];
            }
            return null;
        },

        hotspotForEvent: function(event) {
            if (!this.isActive() || this.hasError()) return null;
            var data = event.event ? event.event() : null;
            if (!data) return null;
            return this.hotspotById(this.roomForMap($gameMap.mapId()), String(data.name).trim());
        },

        // --- 조건 -------------------------------------------------------------
        hasItem: function(id) {
            return this._items.indexOf(id) >= 0;
        },

        // --- 이어하기 (v3.6) : 브라우저에 저장 + 4자리 이어하기 번호 -------------------
        // 데이터 "progress": { "key": "저장 이름", "units": [{ "flag": "hall1", "flags": [...], "items": [...] }, ...],
        //                      "base": { "flags": [...] }, "keepItems": [...], "mult": 271, "add": 1357 }
        progressDef: function() { return (this._data && this._data.progress) || null; },
        progressMask: function() {
            var d = this.progressDef(), self = this, m = 0;
            if (!d) return 0;
            toArray(d.units).forEach(function(u, i) { if (self._flags[u.flag]) m |= (1 << i); });
            return m;
        },
        progressCodeOf: function(mask) {
            var d = this.progressDef(); if (!d || !mask) return '----';
            var n = (mask * Number(d.mult || 271) + Number(d.add || 1357)) % 10000;
            return ('000' + n).slice(-4);
        },
        progressDecode: function(code) {
            var d = this.progressDef(); if (!d) return 0;
            var max = (1 << toArray(d.units).length) - 1;
            for (var m = 1; m <= max; m++) if (this.progressCodeOf(m) === String(code)) return m;
            return 0;
        },
        progressRead: function() {
            var d = this.progressDef(); if (!d) return { mask: 0 };
            try {
                var v = JSON.parse(window.localStorage.getItem('escProgress_' + (d.key || 'game')) || 'null');
                return v && v.mask ? v : { mask: 0 };
            } catch (e) { return { mask: 0 }; }
        },
        progressWrite: function(mask) {
            var d = this.progressDef(); if (!d) return;
            var self = this;
            try {
                var k = 'escProgress_' + (d.key || 'game');
                if (!mask) { window.localStorage.removeItem(k); return; }
                var old = this.progressRead();
                var keep = toArray(d.keepItems).filter(function(it) { return self.hasItem(it) || (old.items || []).indexOf(it) >= 0; });
                window.localStorage.setItem(k, JSON.stringify({ mask: mask | (old.mask || 0), items: keep }));
            } catch (e) {}
        },
        // 저장된 관을 다시 채워 넣기 (조용히). 성공하면 true
        progressApply: function(mask, items) {
            var d = this.progressDef(), self = this;
            if (!d || !mask) return false;
            var addF = function(f) { self._flags[f] = true; };
            var addI = function(it) { if (!self.hasItem(it)) self._items.push(it); };
            toArray(d.base && d.base.flags).forEach(addF);
            toArray(d.units).forEach(function(u, i) {
                if (!(mask & (1 << i))) return;
                addF(u.flag); toArray(u.flags).forEach(addF); toArray(u.items).forEach(addI);
            });
            toArray(items).forEach(addI);
            this.progressWrite(this.progressMask());
            this.refreshHud(); this.applyCompanion();
            return true;
        },

        checkCond: function(c) {
            if (!c) return true;
            var self = this;
            var ok = true;
            toArray(c.flag).concat(toArray(c.flags)).forEach(function(f) { if (!self._flags[f]) ok = false; });
            toArray(c.noFlag).concat(toArray(c.noFlags)).forEach(function(f) { if (self._flags[f]) ok = false; });
            toArray(c.item).concat(toArray(c.items)).forEach(function(it) { if (!self.hasItem(it)) ok = false; });
            toArray(c.noItem).concat(toArray(c.noItems)).forEach(function(it) { if (self.hasItem(it)) ok = false; });
            if (c.boat !== undefined && !!c.boat !== !!self._boat) ok = false;
            if (c.progressSaved !== undefined && !!c.progressSaved !== (self.progressRead().mask > 0)) ok = false;
            return ok;
        },

        // --- 상태 -------------------------------------------------------------
        isBusy: function() {
            if (!this.isActive()) return false;
            if (this._phase === 'error' || this._phase === 'ending' || this._phase === 'done' || this._phase === 'new') return true;
            return this._queue.length > 0 || this._waiting || this._waitCount > 0 ||
                this._waitTransfer || this._bagOpen;
        },

        canInteract: function() {
            return this.isActive() && this._phase === 'play' && !this.isBusy();
        },

        // --- 장면 연결 --------------------------------------------------------
        onSceneStart: function(scene) {
            this._scene = scene;
            if (!this.isActive()) return;
            if (this._data.__error) {
                this._phase = 'error';
                scene.escShowError([this._data.__error]);
                return;
            }
            if (this._errors && this._errors.length > 0) {
                this._phase = 'error';
                scene.escShowError(this._errors);
                return;
            }
            this._waitTransfer = false;
            this.applyCompanion();
            this.applyRoomParallax();
            this.setupWatchers();
            var rmT = this.currentRoom();
            $gameScreen.startTint(rmT && rmT.tint ? toArray(rmT.tint) : [0, 0, 0, 0], 0);
            scene.escRefreshHud();
            this.reportMissingEvents();
            var firstIntro = toArray(this._data.intro)[0];
            if (this._phase !== 'new' || !(firstIntro && firstIntro.movie && hasAsset('movie', firstIntro.movie))) {
                this.updateBgm();
            }
            if (this._phase === 'new') {
                this._phase = 'intro';
                this.runSteps(toArray(this._data.intro), function() {
                    this.hideCloseup();
                    this._phase = 'play';
                    this.refreshHud();
                    this.enterRoom();
                }.bind(this));
            } else {
                this.enterRoom();
            }
        },

        enterRoom: function() {
            var room = this.currentRoom();
            if (room && !this._visited[room.id] && this._scene && this._scene.escTitleCard) {
                this._scene.escTitleCard(room.name || room.id);
            }
            if (room && room.enter && !this._visited[room.id]) {
                this._visited[room.id] = true;
                if (this._queue.length > 0 || this._waiting) {
                    this.insertSteps(toArray(room.enter));
                } else {
                    this.runSteps(toArray(room.enter));
                }
            }
            if (room) this._visited[room.id] = true;
        },

        reportMissingEvents: function() {
            var room = this.currentRoom();
            if (!room) return;
            var names = {};
            $gameMap.events().forEach(function(ev) {
                names[String(ev.event().name).trim()] = true;
            });
            var missing = toArray(room.hotspots).filter(function(h) { return !names[h.id]; })
                .map(function(h) { return h.id; });
            if (missing.length > 0) {
                console.warn('EscapeRoom: 맵 ' + room.map + '번(' + room.id + ')에 이 이름의 이벤트가 없습니다: ' + missing.join(', '));
            }
            this._missing = missing;
        },

        refreshHud: function() {
            if (this._scene && this._scene.escRefreshHud) this._scene.escRefreshHud();
        },

        // --- 데이터 검사 -----------------------------------------------------
        validate: function() {
            var d = this._data;
            var errors = [];
            if (!Array.isArray(d.rooms) || d.rooms.length === 0) return ['rooms(방 목록)가 비어 있습니다.'];
            var roomIds = {};
            var mapIds = {};
            d.rooms.forEach(function(r) {
                roomIds[r.id] = true;
                if (!r.map) {
                    errors.push('방 "' + r.id + '"에 map(맵 번호)이 없습니다.');
                } else if (!$dataMapInfos[Number(r.map)]) {
                    errors.push('방 "' + r.id + '": ' + r.map + '번 맵이 프로젝트에 없습니다.');
                } else if (mapIds[r.map]) {
                    errors.push('방 "' + r.id + '"과 "' + mapIds[r.map] + '"이 같은 ' + r.map + '번 맵을 쓰고 있습니다.');
                }
                mapIds[r.map] = r.id;
            });
            var items = d.items || {};
            var check = function(steps, where) {
                toArray(steps).forEach(function(s) {
                    if (!s || typeof s !== 'object') return;
                    if (s.go && !roomIds[s.go]) errors.push(where + ': 없는 방 "' + s.go + '"(으)로 이동하려 합니다.');
                    toArray(s.give).concat(toArray(s.take)).forEach(function(it) {
                        if (!items[it]) errors.push(where + ': items에 없는 아이템 "' + it + '"');
                    });
                    if (s.dial) {
                        var ds = EscapeManager.dialSlots(s.dial);
                        var da = toArray(s.dial.answer).map(String);
                        if (da.length !== ds.length) errors.push(where + ': 다이얼 칸 수(' + ds.length + ')와 정답 개수(' + da.length + ')가 다릅니다.');
                        da.forEach(function(v, i) {
                            if (ds[i] && ds[i].indexOf(v) < 0) errors.push(where + ': 다이얼 ' + (i + 1) + '번째 칸에 정답 "' + v + '"이(가) 보기 목록에 없습니다.');
                        });
                    }
                    check(s.success, where);
                    check(s.fail, where);
                    check(s.cancel, where);
                });
            };
            var checkCond = function(c, where) {
                if (!c) return;
                toArray(c.item).concat(toArray(c.items), toArray(c.noItem), toArray(c.noItems)).forEach(function(it) {
                    if (!items[it]) errors.push(where + ': 조건에 쓴 아이템 "' + it + '"이(가) items에 없습니다.');
                });
            };
            if (d.startRoom && !roomIds[d.startRoom]) errors.push('startRoom "' + d.startRoom + '"이(가) 없습니다.');
            check(d.intro, '도입(intro)');
            d.rooms.forEach(function(r) {
                if (!r.start) errors.push('방 "' + r.id + '"에 start(도착 위치)가 없습니다.');
                check(r.enter, '방 "' + r.id + '"의 enter');
                var seen = {};
                toArray(r.hotspots).forEach(function(h) {
                    var where = '방 "' + r.id + '" > "' + h.id + '"';
                    if (!h.id) errors.push('방 "' + r.id + '"에 id가 없는 조사 지점이 있습니다.');
                    if (seen[h.id]) errors.push(where + ': 같은 id가 두 번 있습니다.');
                    seen[h.id] = true;
                    checkCond(h.when, where);
                    if (h.cases) {
                        toArray(h.cases).forEach(function(c) {
                            checkCond(c['if'], where);
                            check(c.steps, where);
                        });
                    } else {
                        check(h.steps, where);
                    }
                });
            });
            return errors;
        },

        // --- 새 게임 시작 위치 --------------------------------------------------
        startPosition: function() {
            if (this.hasError()) return null;
            var id = this._data.startRoom || this._data.rooms[0].id;
            var room = this.roomById(id);
            if (!room || !room.start) return null;
            var s = toArray(room.start);
            return { mapId: Number(room.map), x: Number(s[0]), y: Number(s[1]), d: toDir(s[2]) || 2 };
        },

        // --- 조사 ----------------------------------------------------------------
        triggerHotspot: function(h) {
            if (!this.canInteract()) return;
            if (!this.checkCond(h.when)) return;
            var steps = null;
            if (h.cases) {
                var cases = toArray(h.cases);
                for (var i = 0; i < cases.length; i++) {
                    if (this.checkCond(cases[i]['if'])) {
                        steps = cases[i].steps;
                        break;
                    }
                }
            } else {
                steps = h.steps;
            }
            if (!steps) steps = [{ text: '특별한 것은 없어 보인다.' }];
            $gameTemp.clearDestination();
            this.runSteps(toArray(steps), this.hideCloseup.bind(this));
        },

        // --- 단계 실행기 -----------------------------------------------------------
        runSteps: function(steps, onDone) {
            this._queue = toArray(steps).slice();
            this._afterQueue = onDone || null;
            this._waiting = false;
        },

        insertSteps: function(steps) {
            this._queue = toArray(steps).concat(this._queue);
        },

        resume: function() {
            this._waiting = false;
            this._lastModalFrame = Graphics.frameCount;
        },

        update: function(scene) {
            if (!this.isActive() || scene !== this._scene) return;
            if (this._phase === 'error' || this._phase === 'done') return;
            if (this._movie) {
                this.updateMovie();
                return;
            }
            this.updateTimer();
            if (this._chase) this.updateChase();
            if (this._mission) this.updateMission();
            this.updateWatchers();
            if (this._waitTransfer) return;
            if (this._waitCount > 0) {
                this._waitCount--;
            } else {
                while (!this._waiting && this._waitCount === 0 && !this._waitTransfer &&
                       this._queue.length > 0 && !scene.isBusy()) {
                    this.processStep(this._queue.shift());
                }
                if (!this._waiting && this._waitCount === 0 && !this._waitTransfer &&
                    this._queue.length === 0 && this._afterQueue) {
                    var cb = this._afterQueue;
                    this._afterQueue = null;
                    cb();
                }
            }
        },

        updateTimer: function() {
            if (this._phase !== 'play') return;
            this._elapsed += 1 / 60;
            if (!this._data.timeLimit) return;
            var before = Math.ceil(this._timeLeft);
            this._timeLeft -= 1 / 60;
            if (Math.ceil(this._timeLeft) !== before) this.refreshHud();
            if (this._timeLeft <= 0) {
                this._timeLeft = 0;
                this.finishGame(false);
            }
        },

        processStep: function(s) {
            if (typeof s === 'string') s = { text: s };
            if (!s || typeof s !== 'object') return;
            var self = this;
            var scene = this._scene;

            if (s.picture) this.showCloseup(s.picture, s._maxScale);
            if (s.hidePicture) this.hideCloseup();
            if (s.se) playSafeSe(String(s.se), 90, 100);
            if (s.bgm !== undefined) this.playBgm(String(s.bgm || ''));
            if (s.effect) this.playEffect(s);
            if (s.give) {
                toArray(s.give).forEach(function(it) {
                    if (!self.hasItem(it)) self._items.push(it);
                    if (scene && scene.escItemPopup) scene.escItemPopup(it);
                });
                if (!playSafeSe(SE_ITEM, 90, 100)) SoundManager.playUseItem();
            }
            if (s.take) {
                toArray(s.take).forEach(function(it) {
                    var i = self._items.indexOf(it);
                    if (i >= 0) self._items.splice(i, 1);
                });
            }
            if (s.progressLoad) this.progressApply(this.progressRead().mask, this.progressRead().items);
            if (s.progressClear) this.progressWrite(null);
            if (s.progressSave) this.progressWrite(this.progressMask());
            if (s.progressSave || s.progressCode) this._vars.code = this.progressCodeOf(this.progressMask());
            if (s.flag) toArray(s.flag).forEach(function(f) { self._flags[f] = true; });
            if (s.unflag) toArray(s.unflag).forEach(function(f) { delete self._flags[f]; });
            if (s.solve) {
                toArray(s.solve).forEach(function(f) { self._flags[f] = true; });
                if (!playSafeSe(SE_SOLVE, 90, 100)) SoundManager.playRecovery();
                if (scene && scene.escSolveFx) scene.escSolveFx();
            }
            if (s.penalty) this.applyPenalty(Number(s.penalty));
            if (s._hintBonus) {
                this._hintsLeft++;
                this.refreshHud();
                var selfH = this;
                setTimeout(function() {}, 0);
                this._afterQueue = (function(prev) { return function() { if (prev) prev(); selfH.onHint(); }; })(this._afterQueue);
            }
            if (s.goal !== undefined) { this._goal = String(s.goal || ''); if (scene && scene.escRefreshGoal) scene.escRefreshGoal(); }
            if (s.boat !== undefined && !s.go) this.setBoat(!!s.boat);
            if (s.parallax) $gameMap.changeParallax(String(s.parallax), false, false, 0, 0);
            if (s.tint) $gameScreen.startTint(toArray(s.tint), Number(s.duration || 30));
            if (s.give || s.take || s.solve || s.flag || s.unflag) { this.refreshHud(); this.applyCompanion(); }

            if (s.effect === 'gate') {
                this._waiting = true;
                scene.escStartGate(s, this.resume.bind(this));
                return;
            }
            if (s.lock) {
                this.startLock(s);
                return;
            }
            if (s.choice) {
                this.startChoice(s);
                return;
            }
            if (s.dial) {
                this.startDial(s);
                return;
            }
            if (s.movie) {
                if (this.startMovie(s)) return;
            }
            if (s.selectCharacter) {
                this.startSelectCharacter(s);
                return;
            }
            if (s.chase) {
                this.startChase(s.chase);
                return;
            }
            if (s.mission) {
                this.startMission(s.mission);
                return;
            }
            if (s.timing) {
                this.startTiming(s);
                return;
            }
            if (s.text !== undefined) {
                if (s.go || s.escape || s.wait) {
                    this.insertSteps([{ go: s.go, x: s.x, y: s.y, dir: s.dir, fade: s.fade, escape: s.escape, wait: s.wait, boat: s.boat }]);
                }
                this._waiting = true;
                scene._escMsg.say(s.text, s.speaker, this.resume.bind(this), true);
                if (s.openUrl) scene.escArmUrl(String(s.openUrl));
                return;
            }
            if (s.go) {
                this.startTransfer(s);
                return;
            }
            if (s.wait) {
                this._waitCount = Number(s.wait);
                return;
            }
            if (s.escape) {
                this.finishGame(true);
                return;
            }
        },

        // --- 배경 음악 --------------------------------------------------------------
        playBgm: function(name) {
            if (!name) {
                AudioManager.fadeOutBgm(1);
                return;
            }
            if (hasAsset('bgm', name)) {
                AudioManager.playBgm({ name: name, volume: 80, pitch: 100, pan: 0 });
            }
        },

        updateBgm: function() {
            var room = this.currentRoom();
            var name = (room && room.bgm) || this._data.bgm;
            if (name) this.playBgm(name);
        },

        // --- 영상 ------------------------------------------------------------------
        startMovie: function(s) {
            var name = String(s.movie);
            if (!hasAsset('movie', name)) return false;
            AudioManager.stopBgm();
            this._waiting = true;
            // 기본은 건너뛰기 없음. 단계 "skip": true 또는 데이터 "movieSkip": true 일 때만 건너뛸 수 있음
            this._movie = { frames: 0, canSkip: s.skip === true || (s.skip !== false && this._data.movieSkip === true) };
            Graphics._escVideoCancelled = false;
            if (Graphics._video) {
                Graphics._video.style.objectFit = 'contain';
                Graphics._video.style.background = '#000';
            }
            Graphics.playVideo('movies/' + encodeURIComponent(name) + videoExt());
            return true;
        },

        updateMovie: function() {
            var m = this._movie;
            m.frames++;
            var v = Graphics._video;
            var skip = m.canSkip && m.frames > 20 && (Input.isTriggered('ok') || Input.isTriggered('cancel') ||
                TouchInput.isTriggered() || TouchInput.isCancelled());
            var stalled = (m.frames > 150 && v && v.paused && !Graphics._videoLoading && v.currentTime === 0) ||
                (m.frames > 360 && v && (v.error || v.currentTime === 0));
            if ((skip || stalled) && Graphics.isVideoPlaying()) {
                if (v) { v.pause(); v.onerror = null; v.removeAttribute('src'); try { v.load(); } catch (e) {} }
                Graphics._escVideoCancelled = true;
                Graphics._videoLoading = false;
                Graphics._onVideoEnd();
            }
            if (m.frames > 10 && !Graphics.isVideoPlaying()) {
                this._movie = null;
                this.updateBgm();
                this.resume();
            }
        },

        // --- 효과 ------------------------------------------------------------------
        playEffect: function(s) {
            var scene = this._scene;
            var kind = String(s.effect);
            if (kind === 'door') {
                if (scene) scene.escFxDoor(s.target || 'exit');
                this._waitCount = Math.max(this._waitCount, Number(s.wait || 45));
            } else if (kind === 'flash') {
                var c = toArray(s.color).length === 4 ? s.color : [255, 255, 255, 200];
                $gameScreen.startFlash(c, Number(s.duration || 30));
            } else if (kind === 'shake') {
                $gameScreen.startShake(Number(s.power || 5), Number(s.speed || 8), Number(s.duration || 24));
            } else if (kind === 'firework') {
                if (scene) scene.escFirework(s.target);
                $gameScreen.startFlash([255, 250, 230, 110], 16);
                if (!playSafeSe(SE_SOLVE, 85, 110)) SoundManager.playRecovery();
            } else if (kind === 'sparkle') {
                if (scene) scene.escSparkleAt(s.target);
            } else if (kind === 'card') {
                if (scene) scene.escTitleCard(String(s.text || ''));
            }
        },

        wrongFx: function() {
            $gameScreen.startShake(5, 9, 18);
        },

        startTransfer: function(s) {
            var room = this.roomById(s.go);
            var start = toArray(room.start);
            var x = s.x !== undefined ? Number(s.x) : Number(start[0]);
            var y = s.y !== undefined ? Number(s.y) : Number(start[1]);
            var d = s.dir !== undefined ? toDir(s.dir) : (toDir(start[2]) || 0);
            this.hideCloseup();
            this._waitTransfer = true;
            $gameTemp.clearDestination();
            var white = s.fade === 'white';
            if (s.boat !== undefined) this._pendingBoat = !!s.boat;
            if (white) playSafeSe(SE_WARP, 80, 100);
            $gamePlayer.reserveTransfer(Number(room.map), x, y, d, white ? 1 : 0);
        },

        applyPenalty: function(sec) {
            if (this._data.timeLimit && this._timeLeft > 0) {
                this._timeLeft = Math.max(1, this._timeLeft - sec);
                this.refreshHud();
            }
        },

        // --- 자물쇠 ---------------------------------------------------------------
        startLock: function(s) {
            var self = this;
            var scene = this._scene;
            var lock = s.lock;
            var answer = String(lock.answer || '0000');
            var digits = Number(lock.digits || answer.length);
            this._waiting = true;
            scene._escMsg.say(lock.question || (digits + '자리 숫자를 입력하세요.'), s.speaker, null, false);
            var pad = scene._escNumpad;
            pad.setup(digits, scene._escMsg.y);
            pad.setHandler('ok', function() {});
            pad.setHandler('submit', function() {
                if (!pad.isFull()) {
                    SoundManager.playBuzzer();
                    pad.activate();
                    return;
                }
                var correct = lock.progress ? self.progressApply(self.progressDecode(pad.value())) : pad.value() === answer;
                pad.deactivate();
                pad.close();
                scene._escMsg.dismiss();
                if (correct) {
                    SoundManager.playOk();
                    self.insertSteps(toArray(s.success));
                } else {
                    SoundManager.playBuzzer();
                    self.wrongFx();
                    if (self._data.wrongPenalty) self.applyPenalty(Number(self._data.wrongPenalty));
                    self.insertSteps(s.fail ? toArray(s.fail) : [{ text: '딸깍... 열리지 않는다. 다시 생각해 보자.' }]);
                }
                self.resume();
            });
            pad.setHandler('cancel', function() {
                pad.deactivate();
                pad.close();
                scene._escMsg.dismiss();
                self.insertSteps(toArray(s.cancel));
                self.resume();
            });
        },

        // --- 다이얼 자물쇠 -----------------------------------------------------------
        dialSlots: function(d) {
            if (Array.isArray(d.slots)) {
                return d.slots.map(function(list) { return toArray(list).map(String); });
            }
            var syms = toArray(d.symbols).map(String);
            var n = Number(d.count || toArray(d.answer).length || 1);
            var out = [];
            for (var i = 0; i < n; i++) out.push(syms.slice());
            return out;
        },

        startDial: function(s) {
            var self = this;
            var scene = this._scene;
            var d = s.dial;
            var answer = toArray(d.answer).map(String);
            this._waiting = true;
            var win = scene._escDial;
            var question = d.question || '자물쇠를 돌려 맞춰 보자.';
            if (scene.escCloseupVisible()) {
                // 단서 그림을 보면서 풀 수 있도록: 다이얼은 화면 아래, 그림은 그 위로
                win.setup(this.dialSlots(d), d.labels, SH() + 36, question);
                scene.escFitCloseup(win.y - 6);
            } else {
                scene._escMsg.say(question, s.speaker, null, false);
                win.setup(this.dialSlots(d), d.labels, scene._escMsg.y);
            }
            win.setHandler('submit', function() {
                var vals = win.values();
                var correct = vals.length === answer.length && vals.every(function(v, i) { return v === answer[i]; });
                win.deactivate();
                win.close();
                scene._escMsg.dismiss();
                if (correct) {
                    SoundManager.playOk();
                    self.insertSteps(toArray(s.success));
                } else {
                    SoundManager.playBuzzer();
                    self.wrongFx();
                    if (self._data.wrongPenalty) self.applyPenalty(Number(self._data.wrongPenalty));
                    self.insertSteps(s.fail ? toArray(s.fail) : [{ text: '철컥... 맞지 않는다. 다시 생각해 보자.' }]);
                }
                self.resume();
            });
            win.setHandler('cancel', function() {
                win.deactivate();
                win.close();
                scene._escMsg.dismiss();
                self.insertSteps(toArray(s.cancel));
                self.resume();
            });
        },

        // --- 주인공 고르기 -----------------------------------------------------------
        characters: function() {
            return toArray(this._data && this._data.characters);
        },

        // --- 감시(잠행) ----------------------------------------------------------------
        setupWatchers: function() {
            var room = this.currentRoom();
            this._watch = null;
            if (!room || !room.watchers) return;
            var list = [];
            toArray(room.watchers).forEach(function(w) {
                var ev = $gameMap.events().filter(function(e) { return String(e.event().name).trim() === String(w.event); })[0];
                if (!ev) return;
                ev.setMoveSpeed(Number(w.speed || 3));
                ev.setThrough(false);
                list.push({ def: w, ev: ev, idx: 0, wait: 0, home: [ev.x, ev.y, ev.direction()] });
            });
            this._watch = { list: list, cool: 0 };
        },

        watchActive: function() {
            var room = this.currentRoom();
            if (!this._watch || !room) return false;
            if (room.watchIf && !this.checkCond(room.watchIf)) return false;
            return true;
        },

        // 이벤트가 바라보는 쪽으로 퍼지는 시야 칸들
        sightTiles: function(w) {
            var ev = w.ev, d = ev.direction(), n = Number(w.def.sight || 4);
            var dx = d === 6 ? 1 : d === 4 ? -1 : 0, dy = d === 2 ? 1 : d === 8 ? -1 : 0;
            var tiles = [];
            var blocked = function(x, y) {
                if (!$gameMap.isValid(x, y)) return true;
                return $gameMap.regionId(x, y) === WALL_REGION;
            };
            for (var k = 1; k <= n; k++) {
                var cx = ev.x + dx * k, cy = ev.y + dy * k;
                if (blocked(cx, cy)) break;
                var spread = Math.min(1, Math.floor(k / 2));
                for (var s = -spread; s <= spread; s++) {
                    var tx = cx + (dy !== 0 ? s : 0), ty = cy + (dx !== 0 ? s : 0);
                    if (!blocked(tx, ty)) tiles.push([tx, ty]);
                }
            }
            return tiles;
        },

        updateWatchers: function() {
            if (!this._watch || this._phase !== 'play') return;
            var active = this.watchActive();
            var self = this;
            var frozen = this.isBusy() && !this._mission && !this._chase;
            this._watch.list.forEach(function(w) {
                if (!active || frozen || w.ev._erased || w.ev._escHidden) return;
                if (w.ev.isMoving()) return;
                if (w.wait > 0) { w.wait--; return; }
                var route = toArray(w.def.route);
                if (route.length === 0) {
                    // 제자리에서 두리번거리기
                    var dirs = toArray(w.def.look || [2, 4, 8, 6]);
                    w.idx = (w.idx + 1) % dirs.length;
                    w.ev.setDirection(Number(dirs[w.idx]));
                    w.wait = Number(w.def.wait || 70);
                    return;
                }
                var tgt = route[w.idx % route.length];
                if (w.ev.x === tgt[0] && w.ev.y === tgt[1]) {
                    w.idx = (w.idx + 1) % route.length;
                    w.wait = Number(w.def.wait || 40);
                    var nx = route[w.idx % route.length];
                    var d0 = w.ev.findDirectionTo(nx[0], nx[1]);
                    if (d0 > 0) w.ev.setDirection(d0);
                    return;
                }
                var d = w.ev.findDirectionTo(tgt[0], tgt[1]);
                if (d > 0) w.ev.moveStraight(d);
            });
            if (!active || this._watch.cool > 0) { if (this._watch.cool > 0) this._watch.cool--; return; }
            if ((this.isBusy() && !this._mission && !this._chase) || $gamePlayer.isTransferring() || this._waitTransfer) return;
            var px = $gamePlayer.x, py = $gamePlayer.y;
            for (var i = 0; i < this._watch.list.length; i++) {
                var w = this._watch.list[i];
                if (w.ev._erased || w.ev._escHidden) continue;
                var seen = this.sightTiles(w).some(function(t) { return t[0] === px && t[1] === py; });
                if (seen) { this.onCaught(w); return; }
            }
        },

        onCaught: function(w) {
            var room = this.currentRoom();
            this._watch.cool = 90;
            this._caughtCount++;
            SoundManager.playBuzzer();
            $gameScreen.startFlash([255, 40, 40, 160], 20);
            $gameScreen.startShake(6, 9, 18);
            if (w && w.ev) w.ev.turnTowardPlayer();
            if (this._mission) this._mission.caught = true;
            var cp = toArray(room.checkpoint || room.start);
            var steps = toArray(room.caught || [{ text: '들켰다! 처음 자리로 돌아가자.' }]).slice();
            var again = [];
            if (this._mission) {
                var m = this._mission; this._mission = null;
                if (this._scene && this._scene.escRefreshChase) this._scene.escRefreshChase();
                this.resetMission(m);
                steps = steps.concat(toArray(m.def.fail || []));
                again = m.def.retry === false ? [] : [{ mission: m.def }];
            }
            steps.push({ go: room.id, x: Number(cp[0]), y: Number(cp[1]), dir: cp[2] || 'up' });
            steps = steps.concat(again);
            if (room.caughtPenalty) this.applyPenalty(Number(room.caughtPenalty));
            if (this._chase) return;
            this._waiting = false;
            this._queue = steps.concat(this._queue);
            if (!this._afterQueue) this._afterQueue = this.hideCloseup.bind(this);
        },

        // --- 미션 (제한 시간 안에 여러 사람에게 전하기) -------------------------------
        startMission: function(def) {
            var targets = toArray(def.targets).map(String);
            this._mission = { def: def, targets: targets, left: targets.slice(), frames: Math.round(Number(def.time || 60) * 60) };
            this.hideCloseup();
            this._waiting = true;
            $gameTemp.clearDestination();
            if (this._scene && this._scene.escRefreshChase) this._scene.escRefreshChase();
        },

        resetMission: function(m) {
            $gameMap.events().forEach(function(ev) {
                if (m.targets.indexOf(String(ev.event().name).trim()) >= 0) ev._escDelivered = false;
            });
        },

        missionTouch: function(ev) {
            var m = this._mission;
            if (!m) return false;
            var n = String(ev.event().name).trim();
            if (m.targets.indexOf(n) < 0) return false;
            if (m.left.indexOf(n) < 0) { if (this._scene) this._scene.escShowToast('이미 전했다'); return true; }
            m.left.splice(m.left.indexOf(n), 1);
            ev._escDelivered = true;
            if (ev.characterName()) ev.turnTowardPlayer();
            var scene = this._scene;
            if (scene) {
                var c = { x: ev.screenX(), y: ev.screenY() - 30 };
                scene.escBurst(c.x, c.y, 12, '255,236,150', 2);
                scene.escShowToast(String(m.def.doneText || '전했다!') + '  ' + (m.targets.length - m.left.length) + ' / ' + m.targets.length);
                scene.escRefreshChase();
            }
            if (!playSafeSe(SE_ITEM, 80, 110)) SoundManager.playOk();
            if (m.left.length === 0) this.endMission(true);
            return true;
        },

        updateMission: function() {
            var m = this._mission;
            if (!m || this._phase !== 'play') return;
            m.frames--;
            if (m.frames % 60 === 0 && this._scene && this._scene.escRefreshChase) this._scene.escRefreshChase();
            if (m.frames <= 0) this.endMission(false);
        },

        endMission: function(ok) {
            var m = this._mission;
            this._mission = null;
            if (this._scene && this._scene.escRefreshChase) this._scene.escRefreshChase();
            $gameTemp.clearDestination();
            if (ok) {
                this.insertSteps(toArray(m.def.success));
            } else {
                this.resetMission(m);
                var again = m.def.retry === false ? [] : [{ mission: m.def }];
                this.insertSteps(toArray(m.def.fail || [{ text: '시간이 다 되었다! 다시 해 보자.' }]).concat(again));
            }
            this.resume();
        },

        // --- 타이밍 미니게임 -------------------------------------------------------------
        startTiming: function(s) {
            var self = this, scene = this._scene, def = s.timing;
            this._waiting = true;
            if (s.text) scene._escMsg.say(s.text, s.speaker, null, false);
            var win = scene._escTiming;
            win.setup(def);
            win.setHandler('done', function(ok) {
                win.close(); win.deactivate();
                if (s.text) scene._escMsg.dismiss();
                self.insertSteps(toArray(ok ? def.success : def.fail));
                self.resume();
            });
        },

        // 방의 "parallax": [{ "if": 조건, "name": "!그림" }]  조건에 따라 원경 그림 바꾸기
        applyRoomParallax: function() {
            var room = this.currentRoom();
            if (!room || !room.parallax) return;
            var list = toArray(room.parallax);
            for (var i = 0; i < list.length; i++) {
                if (this.checkCond(list[i]['if'])) {
                    if ($gameMap.parallaxName() !== list[i].name) $gameMap.changeParallax(String(list[i].name), false, false, 0, 0);
                    return;
                }
            }
        },

        // --- 배 ---------------------------------------------------------------------
        setBoat: function(on) {
            this._boat = !!on;
            if ($gamePlayer) $gamePlayer.refresh();
        },

        // --- 동료 (따라다니는 캐릭터) ------------------------------------------------
        applyCompanion: function(noRefresh) {
            var c = this._data && this._data.companion;
            if (c && this._companionOverride) { var o = {}; Object.keys(c).forEach(function(k) { o[k] = c[k]; });
                Object.keys(this._companionOverride).forEach(function(k) { o[k] = this._companionOverride[k]; }, this); c = o; }
            if (!c || !$gameParty || !$gamePlayer) return;
            var id = Number(c.actor || 2);
            if (!$dataActors[id] && $dataActors[1]) {      // 데이터베이스에 그 배우가 없으면 1번을 복사해 만듦
                var base = JSON.parse(JSON.stringify($dataActors[1]));
                base.id = id;
                base.name = String(c.name || '동료');
                $dataActors[id] = base;
            }
            if (!$dataActors[id]) return;
            var want = !this._boat && (!c.flag || !!this._flags[c.flag]);
            var has = $gameParty._actors.indexOf(id) >= 0;
            if (want) {
                var a = $gameActors.actor(id);
                if (a.characterName() !== String(c.image)) a.setCharacterImage(String(c.image), Number(c.index || 0));
                if (!has) $gameParty._actors.push(id);
                $gamePlayer._followers.show();
            } else {
                $gamePlayer._followers.hide();
            }
            // 동료 말고 다른 파티원은 따라오지 않게
            var lead = $gameParty._actors[0];
            $gameParty._actors = $gameParty._actors.filter(function(a, i) { return i === 0 || (want && a === id); });
            if (!noRefresh) $gamePlayer.refresh();
            $gamePlayer._followers.refresh();
        },

        // --- 추격 -------------------------------------------------------------------
        startChase: function(def) {
            var targets = toArray(def.targets).map(String);
            var c = { def: def, targets: targets, left: targets.slice(), frames: Math.round(Number(def.time || 90) * 60),
                      speed: Number(def.speed || 4), start: {} };
            $gameMap.events().forEach(function(ev) {
                var n = String(ev.event().name).trim();
                if (targets.indexOf(n) >= 0) {
                    if (!c.start[n]) c.start[n] = [];
                    c.start[n].push([ev.eventId(), ev.event().x, ev.event().y]);
                    ev._erased = false;
                    ev.refresh();
                    ev.locate(ev.event().x, ev.event().y);
                    ev.setMoveSpeed(c.speed);
                    ev.setThrough(false);
                }
            });
            this._chase = c;
            this._waiting = true;
            $gameTemp.clearDestination();
            if (this._scene && this._scene.escRefreshChase) this._scene.escRefreshChase();
        },

        chaseEvents: function() {
            var c = this._chase;
            if (!c) return [];
            return $gameMap.events().filter(function(ev) {
                return !ev._erased && c.left.indexOf(String(ev.event().name).trim()) >= 0;
            });
        },

        updateChase: function() {
            var c = this._chase;
            var scene = this._scene;
            if (!c || this._phase !== 'play') return;
            if (scene && scene._escMsg && scene._escMsg.isOpenAndActive && scene._escMsg.visible && this._chaseMsg) return;
            c.frames--;
            var pl = $gamePlayer;
            var self = this;
            this.chaseEvents().forEach(function(ev) {
                var dist = Math.abs(ev._realX - pl._realX) + Math.abs(ev._realY - pl._realY);
                if (dist <= 1.05) {
                    self.chaseCatch(ev);
                    return;
                }
                if (ev.isMoving()) return;
                if (ev._escRest > 0) { ev._escRest--; return; }
                if (Math.random() < Number(c.def.pause || 0)) { ev._escRest = 6 + Math.floor(Math.random() * 10); return; }
                var dirs = [2, 4, 6, 8].filter(function(d) { return ev.canPass(ev.x, ev.y, d); });
                if (dirs.length === 0) return;
                var near = Math.abs(ev.x - pl.x) + Math.abs(ev.y - pl.y) <= Number(c.def.sight || 8);
                var pick;
                if (near && Math.random() < Number(c.def.smart || 0.8)) {
                    var best = -1;
                    dirs.forEach(function(d) {
                        var nx = $gameMap.roundXWithDirection(ev.x, d), ny = $gameMap.roundYWithDirection(ev.y, d);
                        var nd = Math.abs(nx - pl.x) + Math.abs(ny - pl.y);
                        // 막다른 곳은 피하기: 갈 수 있는 이웃이 많을수록 가산점
                        var free = [2, 4, 6, 8].filter(function(d2) { return ev.canPass(nx, ny, d2); }).length;
                        var score = nd * 10 + free * 3 + Math.random() * 4;
                        if (score > best) { best = score; pick = d; }
                    });
                } else if (near || Math.random() < 0.35) {
                    pick = dirs[Math.floor(Math.random() * dirs.length)];
                }
                if (pick) ev.moveStraight(pick);
            });
            if (c.frames % 60 === 0 && scene && scene.escRefreshChase) scene.escRefreshChase();
            if (c.left.length === 0) {
                this.endChase(true);
            } else if (c.frames <= 0) {
                this.endChase(false);
            }
        },

        chaseCatch: function(ev) {
            var c = this._chase;
            var n = String(ev.event().name).trim();
            var i = c.left.indexOf(n);
            if (i < 0) return;
            // 같은 이름 이벤트가 여러 개면 하나만 지움
            ev.erase();
            var still = $gameMap.events().some(function(e) { return !e._erased && String(e.event().name).trim() === n; });
            if (!still) c.left.splice(i, 1);
            var scene = this._scene;
            if (scene) {
                var p = { x: ev.screenX(), y: ev.screenY() - 24 };
                if (scene.escBurst) scene.escBurst(p.x, p.y, 14, '255,255,255', 2.4);
                var caught = c.targets.length - c.left.length;
                scene.escShowToast && scene.escShowToast(String(c.def.caughtText || '따라잡았다!') + '  ' + caught + ' / ' + c.targets.length);
                scene.escRefreshChase && scene.escRefreshChase();
            }
            if (!playSafeSe(SE_SOLVE, 80, 120)) SoundManager.playRecovery();
            $gameScreen.startFlash([255, 255, 255, 120], 12);
        },

        endChase: function(ok) {
            var c = this._chase;
            this._chase = null;
            if (this._scene && this._scene.escRefreshChase) this._scene.escRefreshChase();
            $gameTemp.clearDestination();
            if (ok) {
                this.insertSteps(toArray(c.def.success));
            } else {
                // 배들을 처음 자리로
                Object.keys(c.start).forEach(function(n) {
                    c.start[n].forEach(function(e) {
                        var ev = $gameMap.event(e[0]);
                        if (!ev) return;
                        ev._erased = false;
                        ev.refresh();
                        ev.locate(e[1], e[2]);
                    });
                });
                var again = c.def.retry === false ? [] : [{ chase: c.def }];
                this.insertSteps(toArray(c.def.fail || [{ text: '놓쳤다! 다시 쫓아가자.' }]).concat(again));
            }
            this.resume();
        },

        applyCharacter: function(c) {
            var actor = $gameParty.leader();
            if (!actor || !c || !c.image) return;
            actor.setCharacterImage(String(c.image), Number(c.index || 0));
            var self = this;
            if (c.flag) toArray(c.flag).forEach(function(f) { self._flags[f] = true; });
            if (c.vars) Object.keys(c.vars).forEach(function(k) { self._vars[k] = c.vars[k]; });
            if (c.companion) this._companionOverride = c.companion;
            this.applyCompanion(true);
            if (c.face) actor.setFaceImage(String(c.face), Number(c.faceIndex || 0));
            $gamePlayer.refresh();
        },

        startSelectCharacter: function(s) {
            var self = this;
            var scene = this._scene;
            var list = this.characters();
            if (list.length === 0) return;
            this._waiting = true;
            scene._escMsg.say(s.question || '누구로 시작할까요?', s.speaker, null, false);
            var win = scene._escChoice;
            win.setup(list.map(function(c) { return c.label || c.image; }), scene._escMsg.y);
            var handler = function() {
                var c = list[win.index()];
                win.deactivate();
                win.close();
                scene._escMsg.dismiss();
                self.applyCharacter(c);
                SoundManager.playOk();
                self.resume();
            };
            for (var i = 0; i < list.length; i++) win.setHandler('choice' + i, handler);
        },

        // --- 선택지 ---------------------------------------------------------------
        startChoice: function(s) {
            var self = this;
            var scene = this._scene;
            var options = toArray(s.choice);
            var answer = Number(s.answer || 0);
            this._waiting = true;
            scene._escMsg.say(s.question || '', s.speaker, null, false);
            var win = scene._escChoice;
            win.setup(options, scene._escMsg.y);
            var handler = function() {
                var picked = win.index() + 1;
                win.deactivate();
                win.close();
                scene._escMsg.dismiss();
                if (!answer) {
                    self.insertSteps(toArray(s['on' + picked]));
                } else if (picked === answer) {
                    SoundManager.playOk();
                    self.insertSteps(toArray(s.success));
                } else {
                    SoundManager.playBuzzer();
                    self.wrongFx();
                    if (self._data.wrongPenalty) self.applyPenalty(Number(self._data.wrongPenalty));
                    self.insertSteps(s.fail ? toArray(s.fail) : [{ text: '아니야... 다시 생각해 보자.' }]);
                }
                self.resume();
            };
            for (var i = 0; i < options.length; i++) {
                win.setHandler('choice' + i, handler);
            }
        },

        // --- 확대 그림 ------------------------------------------------------------
        showCloseup: function(name, maxScale) {
            if (this._scene) this._scene.escShowCloseup(name, maxScale);
        },

        hideCloseup: function() {
            if (this._scene) this._scene.escHideCloseup();
        },

        // --- 가방 ------------------------------------------------------------------
        bagRows: function() {
            var rows = [];
            var items = this._data.items || {};
            if (this._data.hints) {
                rows.push({ hint: true, text: '힌트 보기   (남은 횟수 ' + this._hintsLeft + '/' + this._data.hints + ')' });
            }
            this._items.forEach(function(id) {
                var info = items[id] || { name: id };
                rows.push({ item: id, text: info.name, image: info.image });
            });
            if (this._items.length === 0) rows.push({ text: '아직 모은 물건이 없다.', enabled: false });
            return rows;
        },

        openBag: function() {
            if (!this.canInteract()) return;
            var scene = this._scene;
            var self = this;
            var bag = scene._escBag;
            this._bagOpen = true;
            $gameTemp.clearDestination();
            SoundManager.playOk();
            bag.setup(this.bagRows(), this._bagIndex);
            bag.setHandler('ok', function() {
                var r = bag.currentRow();
                self._bagIndex = bag.index();
                bag.deactivate();
                bag.close();
                self._bagOpen = false;
                if (r.hint) {
                    self.onHint();
                } else if (r.item) {
                    self.showItem(r.item);
                }
            });
            bag.setHandler('cancel', function() {
                self._bagIndex = bag.index();
                bag.deactivate();
                bag.close();
                self._bagOpen = false;
                self.resume();
            });
        },

        showItem: function(id) {
            var info = (this._data.items || {})[id] || { name: id };
            var step = { text: info.desc || '', speaker: info.name };
            if (info.closeup || info.image) {
                step.picture = info.closeup || info.image;
                step._maxScale = info.closeup ? 1 : 2.5;
            }
            this.runSteps([step], function() {
                this.hideCloseup();
                this.openBagAfter = true;
            }.bind(this));
        },

        // --- 힌트 ------------------------------------------------------------------
        currentPuzzle: function() {
            var list = toArray(this._data.puzzles);
            var room = this.currentRoom(), rid = room ? room.id : '';
            var self = this, i, p;
            // v3.5: "rooms" 가 있으면 지금 방에 맞는 수수께끼부터
            for (i = 0; i < list.length; i++) {
                p = list[i];
                if (!this._flags[p.id] && p.rooms && toArray(p.rooms).indexOf(rid) >= 0 && this.checkCond(p['if'])) return p;
            }
            for (i = 0; i < list.length; i++) {
                p = list[i];
                if (!this._flags[p.id] && !p.rooms && this.checkCond(p['if'])) return p;
            }
            return null;
        },

        onHint: function() {
            if (!this._data.hints) return;
            var p = this.currentPuzzle();
            if (!p) {
                this.runSteps([{ speaker: '힌트', text: '이제 남은 수수께끼가 없어요. 출구를 찾아보세요!' }]);
                return;
            }
            var hints = toArray(p.hints);
            var level = this._hintLevel[p.id] || 0;
            if (level >= hints.length) {
                this.runSteps([{ speaker: '힌트 - ' + (p.name || p.id), text: hints[hints.length - 1] || '힌트가 없습니다.' }]);
                return;
            }
            if (this._hintsLeft <= 0) {
                var qz = toArray(this._data.hintQuizzes);
                if (this._quizIndex < qz.length) {
                    var q = qz[this._quizIndex++];
                    var self = this;
                    this.runSteps([
                        { speaker: '힌트', text: '힌트를 모두 썼어요. 역사 퀴즈를 맞히면 힌트를 하나 더 얻을 수 있어요!' },
                        { speaker: '역사 퀴즈', choice: q.choice, answer: q.answer, question: q.question,
                          success: [{ speaker: '역사 퀴즈', text: '정답! ' + (q.explain || '') + ' 힌트 1개를 얻었다.', se: '' }, { _hintBonus: true }],
                          fail: [{ speaker: '역사 퀴즈', text: '아쉬워요! ' + (q.explain || '') }] }]);
                    return;
                }
                SoundManager.playBuzzer();
                this.runSteps([{ speaker: '힌트', text: '힌트를 모두 사용했어요. 지금까지 모은 단서를 다시 살펴보세요.' }]);
                return;
            }
            this._hintsLeft--;
            this._hintsUsed++;
            this._hintLevel[p.id] = level + 1;
            this.refreshHud();
            SoundManager.playOk();
            this.runSteps([{ speaker: '힌트 ' + (level + 1) + ' - ' + (p.name || p.id), text: hints[level] }]);
        },

        // --- 끝내기 ----------------------------------------------------------------
        finishGame: function(success) {
            var scene = this._scene;
            this._phase = 'ending';
            this._queue = [];
            this._afterQueue = null;
            this._waiting = false;
            this._waitCount = 0;
            this._bagOpen = false;
            if (scene) scene.escCloseAll();
            this.hideCloseup();
            this.refreshHud();
            var ending = this._data.ending || {};
            var steps = [];
            if (success && this._data.endingBgm) {
                this.playBgm(this._data.endingBgm);
            } else if (!success) {
                AudioManager.fadeOutBgm(3);
            }
            if (success) {
                steps = steps.concat(toArray(ending.success));
                var used = Math.round(this._elapsed);
                var record = (this._data.recordTitle || '탈출 성공!') + '\n걸린 시간: ' + Math.floor(used / 60) + '분 ' + (used % 60) + '초';
                if (this._data.hints) record += '\n사용한 힌트: ' + this._hintsUsed + '개';
                var arch = toArray(this._data.archives);
                if (arch.length) {
                    var self2 = this;
                    record += '   ·   모은 사료: ' + arch.filter(function(a) { return self2.hasItem(a); }).length + ' / ' + arch.length + '장';
                }
                steps.push({ speaker: '기록', text: record });
            } else {
                steps = steps.concat(toArray(ending.fail || '시간이 다 되었습니다...'));
            }
            steps = steps.concat(toArray(ending.summary));
            var review = this._data.review;
            if (review && review.url) {
                steps.push({ picture: review.picture, speaker: review.speaker || '후기', openUrl: review.url,
                    text: review.text || '끝까지 함께해 줘서 고마워요! Enter나 클릭을 누르면 후기 페이지가 열려요.' });
            }
            this._queue = steps;
            this._afterQueue = function() {
                this._phase = 'done';
                this._started = false;
                if (this._scene) this._scene.fadeOutAll();
                SceneManager.goto(Scene_Title);
            }.bind(this);
        }
    };

    //=========================================================================
    // 새 게임: 시작 방으로, 동료는 숨기기
    //=========================================================================
    var _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        EscapeManager.reset();
        EscapeManager._errors = $dataEscape && !$dataEscape.__error ? EscapeManager.validate() : [];
        var pos = EscapeManager.startPosition();
        if (pos) {
            $gamePlayer.reserveTransfer(pos.mapId, pos.x, pos.y, pos.d, 0);
        }
        $gamePlayer.hideFollowers();
        var chars = EscapeManager.characters();
        if (chars.length > 0 && !EscapeManager.hasError()) EscapeManager.applyCharacter(chars[0]);
    };

    //=========================================================================
    // 이동 제한 / 벽 리전
    //=========================================================================
    var _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        if (EscapeManager.isActive() && (EscapeManager._chase || EscapeManager._mission) && !EscapeManager._chaseMsg) return _Game_Player_canMove.call(this);
        if (EscapeManager.isActive() && EscapeManager.isBusy()) return false;
        return _Game_Player_canMove.call(this);
    };

    var _Game_Map_isPassable = Game_Map.prototype.isPassable;
    Game_Map.prototype.isPassable = function(x, y, d) {
        if (EscapeManager.isRoomMap(this.mapId())) {
            if (this.regionId(x, y) === WALL_REGION) return false;
            if (this.layeredTiles(x, y).every(function(t) { return t === 0; })) return true;
        }
        return _Game_Map_isPassable.call(this, x, y, d);
    };

    // 바다(배로만) / 부두(둘 다) 리전
    Game_CharacterBase.prototype.escIsBoat = function() { return false; };
    Game_Player.prototype.escIsBoat = function() { return !!(EscapeManager && EscapeManager._boat); };
    Game_Event.prototype.escIsBoat = function() {
        var c = EscapeManager && EscapeManager._chase;
        return !!(c && c.targets.indexOf(String(this.event().name).trim()) >= 0);
    };
    var _Game_CharacterBase_isMapPassable = Game_CharacterBase.prototype.isMapPassable;
    Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
        if (EscapeManager.isRoomMap($gameMap.mapId())) {
            var x2 = $gameMap.roundXWithDirection(x, d);
            var y2 = $gameMap.roundYWithDirection(y, d);
            if (!$gameMap.isValid(x2, y2)) return false;
            var r = $gameMap.regionId(x2, y2);
            var boat = this.escIsBoat();
            if (r === WALL_REGION) return false;
            if (r === 4) return false;          // 낮은 울타리: 걸어서는 못 가지만 화살은 넘어감 (v3.4)
            if (r === SEA_REGION) return boat;
            if (r === DOCK_REGION) return true;
            if (boat) return false;
        }
        return _Game_CharacterBase_isMapPassable.call(this, x, y, d);
    };

    // 배를 타면 주인공 그림을 배로 (MV가 그림을 다시 그려도 유지)
    var _Game_Player_refresh = Game_Player.prototype.refresh;
    Game_Player.prototype.refresh = function() {
        _Game_Player_refresh.call(this);
        if (EscapeManager && EscapeManager.isActive && EscapeManager.isActive()) {
            if (EscapeManager._boat) {
                var bs = String(EscapeManager._data.boatSprite || '$boat');
                this.setImage(bs, 0);
                this._followers.hide();
                this._followers.refresh();
            } else {
                EscapeManager.applyCompanion(true);
            }
        }
    };
    var _Game_Player_realMoveSpeed = Game_Player.prototype.realMoveSpeed;
    Game_Player.prototype.realMoveSpeed = function() {
        var v = _Game_Player_realMoveSpeed.call(this);
        return (EscapeManager && EscapeManager._boat) ? v + 1 : v;
    };
    var _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        var was = this.isTransferring();
        if (was && EscapeManager && EscapeManager._pendingBoat !== undefined) {
            EscapeManager._boat = EscapeManager._pendingBoat;
            EscapeManager._pendingBoat = undefined;
        }
        _Game_Player_performTransfer.call(this);
        if (was) this.refresh();
    };

    //=========================================================================
    // 이벤트 = 조사 지점
    //=========================================================================
    // 조사 지점의 "visible" 조건: 조건이 맞을 때만 보이고, 그 전에는 투명·통과
    var _Game_Event_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        _Game_Event_update.call(this);
        if (!EscapeManager.isActive() || this._erased) return;
        var h = EscapeManager.hotspotForEvent(this);
        if (h && (h.follow !== undefined || h.followDelivered) && !this._escHidden && !this.isMoving() &&
            ((h.follow !== undefined && EscapeManager.checkCond(h.follow)) || (h.followDelivered && this._escDelivered))) {
            var ddx = Math.abs(this.x - $gamePlayer.x) + Math.abs(this.y - $gamePlayer.y);
            this.setThrough(true);
            this.setMoveSpeed(4);
            if (ddx > Number(h.followGap || 2)) this.moveTowardCharacter($gamePlayer);
        }
        if (h && h.visible !== undefined) {
            var show = EscapeManager.checkCond(h.visible);
            if (this._escHidden === undefined || this._escHidden === show) {
                this._escHidden = !show;
                this.setTransparent(!show);
                this.setThrough(!show);
            }
        }
    };
    var _Game_Event_isTriggerIn = Game_Event.prototype.isTriggerIn;
    Game_Event.prototype.isTriggerIn = function(triggers) {
        if (this._escHidden) return false;
        return _Game_Event_isTriggerIn.call(this, triggers);
    };

    var _Game_Event_isNormalPriority = Game_Event.prototype.isNormalPriority;
    Game_Event.prototype.isNormalPriority = function() {
        if (this._escHidden) return false;
        if (EscapeManager.hotspotForEvent(this)) return true;
        return _Game_Event_isNormalPriority.call(this);
    };

    var _Game_Event_start = Game_Event.prototype.start;
    Game_Event.prototype.start = function() {
        if (EscapeManager.isActive() && EscapeManager._mission && EscapeManager.missionTouch(this)) return;
        var h = EscapeManager.hotspotForEvent(this);
        if (h) {
            if (this.characterName() && !this.isDirectionFixed() && EscapeManager.canInteract()) {
                this.turnTowardPlayer();
            }
            EscapeManager.triggerHotspot(h);
            return;
        }
        _Game_Event_start.call(this);
    };

    //=========================================================================
    // Scene_Map - 화면 요소 추가
    //=========================================================================
    var _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.call(this);
        if (!EscapeManager.isActive()) return;
        this.escCreateLayer();
        this._escMsg = new Window_EscMessage();
        this._escName = new Window_EscName();
        this._escMsg.setNameWindow(this._escName);
        this._escChoice = new Window_EscChoice();
        this._escNumpad = new Window_EscNumpad();
        this._escBag = new Window_EscBag();
        this._escDial = new Window_EscDial();
        this._escTiming = new Window_EscTiming();
        this.addWindow(this._escMsg);
        this.addWindow(this._escName);
        this.addWindow(this._escChoice);
        this.addWindow(this._escNumpad);
        this.addWindow(this._escBag);
        this.addWindow(this._escDial);
        this.addWindow(this._escTiming);
    };

    Scene_Map.prototype.escCreateLayer = function() {
        var at = this.getChildIndex(this._windowLayer);
        var add = function(sprite) { this.addChildAt(sprite, at++); }.bind(this);

        // 효과 층: 맵(캐릭터) 바로 위
        this._escFx = new Sprite();
        this.addChildAt(this._escFx, this.getChildIndex(this._spriteset) + 1);
        at = this.getChildIndex(this._windowLayer);
        this._escParticles = [];
        this._escOpenSprites = [];
        this._escOpenKey = null;

        this._escWhite = new Sprite(new Bitmap(SW(), SH()));
        this._escWhite.bitmap.fillAll('#fffaf0');
        this._escWhite.opacity = 0;
        add(this._escWhite);

        this._escCard = new Sprite(new Bitmap(SW(), 130));
        this._escCard.y = Math.floor(SH() * 0.28);
        this._escCard.opacity = 0;
        this._escCardT = 0;
        add(this._escCard);

        this._escToast = new Sprite(new Bitmap(360, 40));
        this._escToast.x = (SW() - 360) / 2;
        this._escToast.y = HUD_H + 8;
        this._escToast.opacity = 0;
        this._escToastT = 0;

        this._escDebug = new Sprite(new Bitmap(SW(), SH()));
        this._escDebug.visible = SHOW_DEBUG;
        add(this._escDebug);

        this._escTip = new Sprite(new Bitmap(300, 34));
        this._escTip.visible = false;
        this._escTipText = '';
        add(this._escTip);

        this._escDim = new Sprite(new Bitmap(SW(), SH()));
        this._escDim.bitmap.fillAll('rgba(0,0,0,0.6)');
        this._escDim.visible = false;
        add(this._escDim);

        this._escCloseup = new Sprite();
        this._escCloseup.anchor.x = 0.5;
        this._escCloseup.anchor.y = 0.5;
        this._escCloseup.x = SW() / 2;
        this._escCloseup.visible = false;
        add(this._escCloseup);

        this._escHud = new Sprite(new Bitmap(SW(), HUD_H));
        add(this._escHud);
        add(this._escToast);

        // 목표 안내 (왼쪽 위)
        this._escGoal = new Sprite(new Bitmap(520, 34));
        this._escGoal.x = 8;
        this._escGoal.y = HUD_H + 6;
        add(this._escGoal);
        this.escRefreshGoal();

        // 추격 안내 (가운데 위)
        this._escChase = new Sprite(new Bitmap(420, 44));
        this._escChase.x = (SW() - 420) / 2;
        this._escChase.y = HUD_H + 6;
        this._escChase.visible = false;
        add(this._escChase);
        this.escRefreshChase();

        this._escError = new Sprite();
        add(this._escError);

        // 감시 시야 (빨간 칸)
        this._escSight = new PIXI.Graphics();
        this._escFx.addChildAt(this._escSight, 0);

        // 찾아갈 곳 표시 (통통 튀는 화살표)
        this._escMarks = new Sprite();
        this._escFx.addChild(this._escMarks);
        this._escMarkKey = '';
        this._escMarkList = [];
        this.escArmFullButton();

        this._escDebugText = '';
    };

    var _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        if (EscapeManager.isActive()) {
            this.escInstallKeys();
            EscapeManager.onSceneStart(this);
        }
    };

    var _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        _Scene_Map_terminate.call(this);
        this.escRemoveKeys();
        if (this._escFullHandler) {
            var f = this._escFullHandler; this._escFullHandler = null;
            ['mousedown', 'touchend'].forEach(function(n) { document.removeEventListener(n, f, true); });
        }
    };

    Scene_Map.prototype.escArmFullButton = function() {
        if (this._escFullHandler || !FULL_BUTTON) return;
        var self = this;
        this._escFullHandler = function(ev) {
            if (SceneManager._scene !== self || !EscapeManager.isActive() || EscapeManager._phase !== 'play') return;
            var pt = ev.changedTouches && ev.changedTouches[0] ? ev.changedTouches[0] : ev;
            var x = Graphics.pageToCanvasX(pt.pageX), y = Graphics.pageToCanvasY(pt.pageY);
            var r = self.escButtonRects().filter(function(b) { return b.id === 'full'; })[0];
            if (r && x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) {
                escToggleFullscreen();
                if (ev.cancelable) ev.preventDefault();
            }
        };
        ['mousedown', 'touchend'].forEach(function(n) { document.addEventListener(n, self._escFullHandler, true); });
    };

    // 브라우저는 사용자가 키를 누르거나 클릭한 순간에만 새 창을 허용하므로,
    // 그 순간(DOM 이벤트 안)에 링크를 엽니다.
    Scene_Map.prototype.escArmUrl = function(url) {
        this._escUrl = url;
        this._escUrlFrame = Graphics.frameCount;
    };

    Scene_Map.prototype.escTryOpenUrl = function() {
        if (!this._escUrl || !this._escMsg) return;
        if (Graphics.frameCount < this._escUrlFrame + 10) return;
        if (this._escMsg.isTyping()) return;
        var url = this._escUrl;
        this._escUrl = null;
        openExternal(url);
    };

    Scene_Map.prototype.escInstallKeys = function() {
        var self = this;
        this._escGesture = function(e) {
            if (SceneManager._scene !== self) return;
            if (e.type === 'keydown' && ['Enter', ' ', 'z', 'Z'].indexOf(e.key) < 0) return;
            if (e.type === 'mousedown' && e.button !== 0) return;
            self.escTryOpenUrl();
        };
        document.addEventListener('keydown', this._escGesture);
        document.addEventListener('mousedown', this._escGesture);
        document.addEventListener('touchend', this._escGesture);
        this._escKey = function(e) {
            if (!SceneManager._scene || SceneManager._scene !== self) return;
            if (self._escNumpad && self._escNumpad.active) {
                var k = e.key;
                if (k && k.length === 1 && k >= '0' && k <= '9') {
                    self._escNumpad.addDigit(k);
                    e.preventDefault();
                } else if (k === 'Backspace') {
                    self._escNumpad.backspace();
                    e.preventDefault();
                }
                return;
            }
            if ((e.key === 'h' || e.key === 'H' || e.key === 'ㅗ') && EscapeManager.canInteract()) {
                EscapeManager.onHint();
            }
        };
        this._escMouse = function(e) {
            var x = Graphics.pageToCanvasX(e.pageX);
            var y = Graphics.pageToCanvasY(e.pageY);
            var b = self.escButtonAt(x, y);
            document.body.style.cursor = b && EscapeManager.canInteract() ? 'pointer' : '';
        };
        document.addEventListener('keydown', this._escKey);
        document.addEventListener('mousemove', this._escMouse);
    };

    Scene_Map.prototype.escRemoveKeys = function() {
        if (this._escKey) document.removeEventListener('keydown', this._escKey);
        if (this._escMouse) document.removeEventListener('mousemove', this._escMouse);
        if (this._escGesture) {
            document.removeEventListener('keydown', this._escGesture);
            document.removeEventListener('mousedown', this._escGesture);
            document.removeEventListener('touchend', this._escGesture);
        }
        document.body.style.cursor = '';
    };

    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (escResize.pending && escMapResizeSafe(this)) {
            escApplyWidth(escResize.pending);
            $gamePlayer.center($gamePlayer.x, $gamePlayer.y);
            SceneManager.goto(Scene_Map);
            return;
        }
        if (!EscapeManager.isActive() || !this._escHud) return;
        EscapeManager.update(this);
        if (EscapeManager.openBagAfter && EscapeManager.canInteract()) {
            EscapeManager.openBagAfter = false;
            EscapeManager.openBag();
        }
        this.escUpdateTip();
        this.escUpdateFx();
        if (SHOW_DEBUG) this.escUpdateDebug();
    };

    // 가방 열기 (메뉴 대신)
    var _Scene_Map_isMenuEnabled = Scene_Map.prototype.isMenuEnabled;
    Scene_Map.prototype.isMenuEnabled = function() {
        if (EscapeManager.isActive()) return EscapeManager.canInteract() && !$gameMap.isEventRunning();
        return _Scene_Map_isMenuEnabled.call(this);
    };

    var _Scene_Map_callMenu = Scene_Map.prototype.callMenu;
    Scene_Map.prototype.callMenu = function() {
        if (EscapeManager.isActive()) {
            this.menuCalling = false;
            EscapeManager.openBag();
            return;
        }
        _Scene_Map_callMenu.call(this);
    };

    // 위쪽 버튼 클릭
    Scene_Map.prototype.escButtonRects = function() {
        var rects = [];
        var right = SW() - 8;
        if (EscapeManager._data && EscapeManager._data.hints) {
            rects.push({ id: 'hint', x: right - 118, y: 5, w: 118, h: HUD_H - 10 });
            right -= 126;
        }
        rects.push({ id: 'bag', x: right - 92, y: 5, w: 92, h: HUD_H - 10 });
        right -= 100;
        if (FULL_BUTTON && escCanFullscreen(true)) rects.push({ id: 'full', x: right - 96, y: 5, w: 96, h: HUD_H - 10 });
        return rects;
    };

    Scene_Map.prototype.escButtonAt = function(x, y) {
        if (!EscapeManager.isActive() || EscapeManager._phase !== 'play') return null;
        var list = this.escButtonRects();
        for (var i = 0; i < list.length; i++) {
            var r = list[i];
            if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) return r.id;
        }
        return null;
    };

    var _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function() {
        if (EscapeManager.isActive() && TouchInput.isTriggered() && TouchInput.y < HUD_H) {
            var b = this.escButtonAt(TouchInput.x, TouchInput.y);
            if (b === 'bag') EscapeManager.openBag();
            if (b === 'hint' && EscapeManager.canInteract()) EscapeManager.onHint();
            this._touchCount = 0;
            return;
        }
        _Scene_Map_processMapTouch.call(this);
    };

    // --- 상단 표시줄 ---------------------------------------------------------
    Scene_Map.prototype.escRefreshHud = function() {
        if (!this._escHud) return;
        var M = EscapeManager;
        var bmp = this._escHud.bitmap;
        bmp.clear();
        if (M._phase === 'error') return;
        var ctx = ctxOf(bmp);
        var g = ctx.createLinearGradient(0, 0, 0, HUD_H);
        g.addColorStop(0, 'rgba(10,8,6,0.82)');
        g.addColorStop(1, 'rgba(10,8,6,0.45)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, SW(), HUD_H);
        setDirty(bmp);
        var room = M.currentRoom();
        bmp.fontSize = 20;
        bmp.textColor = '#ffe9b0';
        bmp.drawText(room ? (room.name || room.id) : '', 14, 0, 330, HUD_H, 'left');
        if (M._data.timeLimit && M._phase !== 'intro' && M._phase !== 'new') {
            var sec = M._timeLeft;
            bmp.textColor = sec <= 60 ? '#ff7a6a' : '#ffffff';
            bmp.fontSize = 22;
            bmp.drawText('⏱ ' + formatTime(sec), SW() / 2 - 60, 0, 120, HUD_H, 'center');
        }
        if (M._phase === 'play') {
            var self = this;
            this.escButtonRects().forEach(function(r) {
                var label = r.id === 'bag' ? '가방 (' + M._items.length + ')' : r.id === 'full' ? (escIsFullscreen() ? '창 모드' : '전체 화면') : '힌트 ' + M._hintsLeft + '/' + M._data.hints;
                var fill = r.id === 'hint' ? (M._hintsLeft > 0 ? 'rgba(196,140,52,0.95)' : 'rgba(90,90,90,0.85)') : r.id === 'full' ? 'rgba(60,110,90,0.95)' : 'rgba(70,96,120,0.95)';
                roundRect(bmp, r.x, r.y, r.w, r.h, 8, fill, 'rgba(255,255,255,0.45)', 1);
                bmp.fontSize = 18;
                bmp.textColor = '#ffffff';
                bmp.drawText(label, r.x, r.y, r.w, r.h, 'center');
            });
            self = null;
        }
    };

    // --- 바라보는 물건 이름표 --------------------------------------------------
    Scene_Map.prototype.escFacingEvent = function() {
        var p = $gamePlayer;
        var x = $gameMap.roundXWithDirection(p.x, p.direction());
        var y = $gameMap.roundYWithDirection(p.y, p.direction());
        var list = $gameMap.eventsXy(x, y);
        for (var i = 0; i < list.length; i++) {
            var h = EscapeManager.hotspotForEvent(list[i]);
            if (h && EscapeManager.checkCond(h.when)) return { event: list[i], hotspot: h };
        }
        return null;
    };

    Scene_Map.prototype.escUpdateTip = function() {
        var f = null;
        if (EscapeManager.canInteract() && !$gamePlayer.isMoving()) f = this.escFacingEvent();
        var label = f ? (f.hotspot.label || f.hotspot.id) : '';
        if (label !== this._escTipText) {
            this._escTipText = label;
            var bmp = this._escTip.bitmap;
            bmp.clear();
            if (label) {
                bmp.fontSize = 18;
                var text = label + '  [조사]';
                var w = Math.min(296, bmp.measureTextWidth(text) + 24);
                roundRect(bmp, 2, 2, w, 28, 14, 'rgba(20,14,8,0.85)', 'rgba(255,224,160,0.85)', 1);
                bmp.textColor = '#ffe9b0';
                bmp.drawText(text, 14, 2, w - 24, 28, 'left');
                this._escTipW = w;
            }
        }
        this._escTip.visible = !!label;
        if (f) {
            var ex = f.event.screenX();
            var ey = f.event.screenY() - 64;
            this._escTip.x = Math.max(4, Math.min(SW() - this._escTipW - 4, ex - this._escTipW / 2));
            this._escTip.y = Math.max(HUD_H + 2, ey);
        }
    };

    // =========================================================================
    // 효과 (FX)
    // =========================================================================
    Scene_Map.prototype.escTileCenter = function(x, y) {
        var tw = $gameMap.tileWidth();
        var th = $gameMap.tileHeight();
        return { x: $gameMap.adjustX(x) * tw + tw / 2, y: $gameMap.adjustY(y) * th + th / 2 };
    };

    Scene_Map.prototype.escHotspotEvents = function(id) {
        return $gameMap.events().filter(function(ev) { return String(ev.event().name).trim() === id; });
    };

    Scene_Map.prototype.escHotspotCenter = function(id) {
        var list = this.escHotspotEvents(id);
        if (list.length === 0) return null;
        var sx = 0, sy = 0, self = this;
        list.forEach(function(ev) {
            var c = self.escTileCenter(ev.x, ev.y);
            sx += c.x; sy += c.y;
        });
        return { x: sx / list.length, y: sy / list.length, n: list.length };
    };

    Scene_Map.prototype.escPlayerPos = function() {
        return { x: $gamePlayer.screenX(), y: $gamePlayer.screenY() - 24 };
    };

    Scene_Map.prototype.escSpawn = function(o) {
        var sp = new Sprite(o.bitmap);
        sp.anchor.x = 0.5;
        sp.anchor.y = 0.5;
        sp.x = o.x;
        sp.y = o.y;
        sp.blendMode = o.blend === false ? 0 : 1;
        sp.scale.x = sp.scale.y = o.scale || 1;
        this._escFx.addChild(sp);
        this._escParticles.push({ sp: sp, vx: o.vx || 0, vy: o.vy || 0, life: o.life || 40, max: o.life || 40,
            ds: o.ds || 0, g: o.g || 0, tx: o.tx, ty: o.ty, spin: o.spin || 0, alpha: o.alpha || 255 });
        return sp;
    };

    Scene_Map.prototype.escBurst = function(x, y, n, rgb, speed) {
        for (var i = 0; i < n; i++) {
            var a = Math.random() * Math.PI * 2;
            var v = (speed || 3) * (0.4 + Math.random());
            this.escSpawn({ bitmap: fxSpark(rgb || '255,220,120'), x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1,
                life: 30 + Math.floor(Math.random() * 25), ds: -0.012, scale: 0.6 + Math.random() * 0.8, g: 0.04, spin: 0.1 });
        }
    };

    Scene_Map.prototype.escFxDoor = function(target) {
        var c = this.escHotspotCenter(target);
        if (!c) c = this.escPlayerPos();
        if (!playSafeSe(SE_DOOR, 90, 100)) SoundManager.playOk();
        $gameScreen.startFlash([255, 240, 200, 150], 24);
        var ring = this.escSpawn({ bitmap: fxGlow(160, '255,236,170'), x: c.x, y: c.y, life: 45, ds: 0.05, scale: 0.4 });
        ring.opacity = 255;
        this.escBurst(c.x, c.y, 34, '255,226,140', 4);
        this._escOpenKey = null;
    };

    Scene_Map.prototype.escSolveFx = function() {
        var p = this.escPlayerPos();
        for (var i = 0; i < 14; i++) {
            this.escSpawn({ bitmap: fxSpark('255,236,150'), x: p.x + (Math.random() - 0.5) * 50, y: p.y + 10 + Math.random() * 20,
                vx: (Math.random() - 0.5) * 0.6, vy: -1.2 - Math.random() * 1.4, life: 50 + Math.floor(Math.random() * 20),
                scale: 0.5 + Math.random() * 0.6, ds: -0.006, spin: 0.08 });
        }
        this.escSpawn({ bitmap: fxGlow(120, '255,240,180'), x: p.x, y: p.y, life: 40, ds: 0.03, scale: 0.5 });
    };

    Scene_Map.prototype.escFirework = function(target) {
        var c = target ? this.escHotspotCenter(target) : null;
        if (!c) c = this.escPlayerPos();
        var cols = ['255,214,90', '120,220,255', '255,130,170', '170,255,150', '255,255,255'];
        for (var k = 0; k < 5; k++) {
            var ox = (k === 0) ? 0 : (Math.random() - 0.5) * 120, oy = (k === 0) ? -10 : -30 - Math.random() * 60;
            this.escBurst(c.x + ox, c.y + oy, k === 0 ? 30 : 16, cols[k], k === 0 ? 3.4 : 2.4);
        }
        this.escSpawn({ bitmap: fxGlow(140, '255,240,200'), x: c.x, y: c.y - 10, life: 45, ds: 0.03, scale: 0.6 });
    };

    Scene_Map.prototype.escSparkleAt = function(target) {
        var c = target ? this.escHotspotCenter(target) : null;
        if (!c) c = this.escPlayerPos();
        this.escBurst(c.x, c.y, 20, '200,230,255', 2.5);
    };

    Scene_Map.prototype.escItemPopup = function(id) {
        var info = (EscapeManager._data.items || {})[id] || { name: id };
        var p = this.escPlayerPos();
        if (info.image) {
            var bmp = ImageManager.loadPicture(info.image);
            var sp = this.escSpawn({ bitmap: bmp, x: p.x, y: p.y - 20, vy: -0.7, life: 80, scale: 0.55, blend: false });
            sp.blendMode = 0;
        }
        this.escSpawn({ bitmap: fxGlow(100, '255,244,190'), x: p.x, y: p.y - 30, life: 50, ds: 0.02, scale: 0.6 });
        this.escBurst(p.x, p.y - 30, 12, '255,236,150', 2);
        var b = this._escToast.bitmap;
        b.clear();
        roundRect(b, 2, 2, 356, 36, 18, 'rgba(30,22,10,0.88)', 'rgba(255,214,120,0.95)', 2);
        b.fontSize = 20;
        b.textColor = '#ffe9b0';
        b.drawText('✦ ' + info.name + ' 획득!', 0, 2, 360, 36, 'center');
        this._escToastT = 110;
    };

    Scene_Map.prototype.escShowToast = function(text) {
        var b = this._escToast.bitmap;
        b.clear();
        roundRect(b, 2, 2, 356, 36, 18, 'rgba(30,22,10,0.88)', 'rgba(255,214,120,0.95)', 2);
        b.fontSize = 20;
        b.textColor = '#ffe9b0';
        b.drawText(String(text), 0, 2, 360, 36, 'center');
        this._escToastT = 110;
    };

    Scene_Map.prototype.escRefreshGoal = function() {
        if (!this._escGoal) return;
        var b = this._escGoal.bitmap;
        b.clear();
        var g = escSub(EscapeManager._goal);
        this._escGoal.visible = !!g;
        if (!g) return;
        b.fontSize = 18;
        var w = Math.min(516, b.measureTextWidth('목표  ' + g) + 34);
        roundRect(b, 1, 1, w, 30, 14, 'rgba(10,30,50,0.72)', 'rgba(140,210,255,0.8)', 1.5);
        b.textColor = '#9fe0ff';
        b.drawText('목표', 12, 1, 60, 30, 'left');
        b.textColor = '#ffffff';
        b.drawText(g, 56, 1, w - 62, 30, 'left');
    };

    Scene_Map.prototype.escRefreshChase = function() {
        if (!this._escChase) return;
        var c = EscapeManager._chase || EscapeManager._mission;
        this._escChase.visible = !!c;
        if (this._escGoal) this._escGoal.visible = !c && !!EscapeManager._goal;
        if (!c) return;
        var b = this._escChase.bitmap;
        b.clear();
        roundRect(b, 2, 2, 416, 40, 20, 'rgba(60,10,10,0.85)', 'rgba(255,150,120,0.95)', 2);
        var sec = Math.max(0, Math.ceil(c.frames / 60));
        b.fontSize = 22;
        b.textColor = sec <= 15 ? '#ff9a8a' : '#ffffff';
        var label = String(c.def.label || '쫓아가자!');
        b.drawText(label + '   ' + (c.targets.length - c.left.length) + ' / ' + c.targets.length + '   ⏱ ' + sec + '초', 0, 2, 420, 40, 'center');
    };

    Scene_Map.prototype.escTitleCard = function(text) {
        var parts = String(text).split('·');
        var top = parts.length > 1 ? parts[0].trim() : '';
        var main = parts.length > 1 ? parts.slice(1).join('·').trim() : String(text);
        var b = this._escCard.bitmap;
        b.clear();
        var ctx = ctxOf(b);
        var g = ctx.createLinearGradient(0, 0, SW(), 0);
        g.addColorStop(0, 'rgba(10,8,6,0)');
        g.addColorStop(0.2, 'rgba(10,8,6,0.78)');
        g.addColorStop(0.8, 'rgba(10,8,6,0.78)');
        g.addColorStop(1, 'rgba(10,8,6,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 10, SW(), 110);
        setDirty(b);
        b.fillRect(SW() * 0.2, 12, SW() * 0.6, 2, 'rgba(255,214,120,0.85)');
        b.fillRect(SW() * 0.2, 116, SW() * 0.6, 2, 'rgba(255,214,120,0.85)');
        if (top) {
            b.fontSize = 22;
            b.textColor = '#ffd27a';
            b.drawText(top, 0, 18, SW(), 34, 'center');
        }
        b.fontSize = 38;
        b.textColor = '#ffffff';
        b.drawText(main, 0, top ? 54 : 36, SW(), 54, 'center');
        this._escCardT = 170;
    };

    Scene_Map.prototype.escRefreshOpen = function() {
        var room = EscapeManager.currentRoom();
        var list = room ? toArray(room.hotspots).filter(function(h) {
            return h.open && EscapeManager.checkCond(h.open);
        }) : [];
        var key = list.map(function(h) { return h.id; }).join(',');
        if (key === this._escOpenKey) return;
        this._escOpenKey = key;
        var self = this;
        this._escOpenSprites.forEach(function(o) { self._escFx.removeChild(o.sp); });
        this._escOpenSprites = [];
        list.forEach(function(h) {
            var style = h.openStyle || 'door';
            if (style === 'glow') {
                var c = self.escHotspotCenter(h.id);
                if (!c) return;
                var sp = new Sprite(fxGlow(256, '255,236,170'));
                sp.anchor.x = sp.anchor.y = 0.5;
                sp.blendMode = 1;
                self._escFx.addChildAt(sp, 0);
                self._escOpenSprites.push({ sp: sp, id: h.id, style: style, base: 0.7 + c.n * 0.08 });
                var rays = new Sprite(fxRays(256));
                rays.anchor.x = rays.anchor.y = 0.5;
                rays.blendMode = 1;
                self._escFx.addChildAt(rays, 0);
                self._escOpenSprites.push({ sp: rays, id: h.id, style: 'rays', base: 0.7 + c.n * 0.08 });
            } else {
                self.escHotspotEvents(h.id).forEach(function(ev) {
                    var sp = new Sprite(fxDoorway());
                    sp.anchor.x = sp.anchor.y = 0.5;
                    sp.blendMode = 1;
                    self._escFx.addChildAt(sp, 0);
                    self._escOpenSprites.push({ sp: sp, ev: ev, style: 'door' });
                });
            }
        });
    };

    Scene_Map.prototype.escDrawSight = function() {
        var g = this._escSight;
        if (!g) return;
        g.clear();
        var M = EscapeManager;
        if (!M._watch || !M.watchActive() || M._phase !== 'play') return;
        var tw = $gameMap.tileWidth(), th = $gameMap.tileHeight();
        var pulse = 0.22 + 0.08 * Math.sin(Graphics.frameCount / 8);
        M._watch.list.forEach(function(w) {
            if (w.ev._erased || w.ev._escHidden) return;
            M.sightTiles(w).forEach(function(t) {
                var sx = Math.round($gameMap.adjustX(t[0]) * tw), sy = Math.round($gameMap.adjustY(t[1]) * th);
                g.beginFill(0xff3020, pulse);
                g.drawRect(sx + 2, sy + 2, tw - 4, th - 4);
                g.endFill();
            });
            // 머리 위 경계 표시
            var ex = Math.round($gameMap.adjustX(w.ev._realX) * tw + tw / 2), ey = Math.round($gameMap.adjustY(w.ev._realY) * th - 12);
            g.beginFill(0xffcc30, 0.95); g.drawCircle(ex, ey - 30, 7); g.endFill();
            g.beginFill(0x402000, 1); g.drawRect(ex - 1.5, ey - 35, 3, 6); g.drawRect(ex - 1.5, ey - 27, 3, 2.5); g.endFill();
        });
    };

    // 조사 지점의 "mark": "이름" (+ "markIf": 조건) → 그 위에 통통 튀는 화살표와 이름표
    Scene_Map.prototype.escUpdateMarks = function() {
        if (!this._escMarks) return;
        var M = EscapeManager, room = M.currentRoom();
        var list = [];
        if (room && M._phase === 'play') {
            toArray(room.hotspots).forEach(function(h) {
                if (h.mark && M.checkCond(h.markIf) && (h.visible === undefined || M.checkCond(h.visible))) list.push(h);
            });
        }
        var key = list.map(function(h) { return h.id; }).join(',');
        if (key !== this._escMarkKey) {
            this._escMarkKey = key;
            this._escMarks.removeChildren();
            this._escMarkList = list.map(function(h) {
                var text = typeof h.mark === 'string' ? h.mark : (h.label || h.id);
                var bmp = new Bitmap(220, 64);
                bmp.fontSize = 18;
                var w = Math.min(214, bmp.measureTextWidth(text) + 26);
                roundRect(bmp, (220 - w) / 2, 2, w, 28, 13, 'rgba(255,214,60,0.95)', 'rgba(90,60,10,0.9)', 2);
                bmp.textColor = '#3a2608'; bmp.outlineWidth = 0;
                bmp.drawText(text, 0, 2, 220, 28, 'center');
                var ctx = ctxOf(bmp);
                ctx.fillStyle = 'rgba(255,214,60,0.98)'; ctx.strokeStyle = 'rgba(90,60,10,0.9)'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(98, 34); ctx.lineTo(122, 34); ctx.lineTo(110, 52); ctx.closePath(); ctx.fill(); ctx.stroke();
                setDirty(bmp);
                var sp = new Sprite(bmp);
                sp.anchor.x = 0.5; sp.anchor.y = 1;
                return { h: h, sp: sp };
            });
            var self = this;
            this._escMarkList.forEach(function(m) { self._escMarks.addChild(m.sp); });
        }
        var t = Graphics.frameCount, self2 = this;
        this._escMarkList.forEach(function(m, i) {
            var c = self2.escHotspotCenter(m.h.id);
            if (!c) { m.sp.visible = false; return; }
            m.sp.visible = true;
            m.sp.x = c.x;
            m.sp.y = c.y - 34 + Math.sin(t / 10 + i) * 5;
        });
    };

    Scene_Map.prototype.escUpdateFx = function() {
        var t = Graphics.frameCount;
        var self = this;
        this.escUpdateMarks();
        this.escDrawSight();
        // 열린 문 / 빛나는 물건
        this.escRefreshOpen();
        this._escOpenSprites.forEach(function(o) {
            if (o.style === 'door') {
                var c = self.escTileCenter(o.ev.x, o.ev.y);
                o.sp.x = c.x;
                o.sp.y = c.y;
                o.sp.opacity = 170 + Math.sin(t / 18) * 50;
            } else {
                var cc = self.escHotspotCenter(o.id);
                if (!cc) return;
                o.sp.x = cc.x;
                o.sp.y = cc.y;
                if (o.style === 'rays') {
                    o.sp.rotation = t / 160;
                    o.sp.scale.x = o.sp.scale.y = o.base;
                    o.sp.opacity = 80 + Math.sin(t / 25) * 30;
                } else {
                    var s = o.base + Math.sin(t / 22) * 0.08;
                    o.sp.scale.x = o.sp.scale.y = s;
                    o.sp.opacity = 130 + Math.sin(t / 22) * 40;
                }
            }
        });
        // 파티클
        for (var i = this._escParticles.length - 1; i >= 0; i--) {
            var q = this._escParticles[i];
            q.life--;
            if (q.tx !== undefined) {
                q.sp.x += (q.tx - q.sp.x) * 0.08;
                q.sp.y += (q.ty - q.sp.y) * 0.08;
            } else {
                q.vy += q.g;
                q.sp.x += q.vx;
                q.sp.y += q.vy;
            }
            q.sp.rotation += q.spin;
            q.sp.scale.x = q.sp.scale.y = Math.max(0.05, q.sp.scale.x + q.ds);
            q.sp.opacity = q.alpha * Math.min(1, q.life / (q.max * 0.5));
            if (q.life <= 0) {
                this._escFx.removeChild(q.sp);
                this._escParticles.splice(i, 1);
            }
        }
        // 시대 카드
        if (this._escCardT > 0) {
            this._escCardT--;
            var e = 170 - this._escCardT;
            this._escCard.opacity = e < 20 ? e / 20 * 255 : (this._escCardT < 30 ? this._escCardT / 30 * 255 : 255);
        } else {
            this._escCard.opacity = 0;
        }
        // 획득 알림
        if (this._escToastT > 0) {
            this._escToastT--;
            var f = 110 - this._escToastT;
            this._escToast.opacity = f < 10 ? f / 10 * 255 : (this._escToastT < 20 ? this._escToastT / 20 * 255 : 255);
        } else {
            this._escToast.opacity = 0;
        }
        if (this._escCine) this.escUpdateGate();
    };

    // --- 시간의 문 연출 ---------------------------------------------------------
    Scene_Map.prototype.escStartGate = function(s, done) {
        var self = this;
        var items = EscapeManager._data.items || {};
        var target = s.target || 'gate';
        var c = this.escHotspotCenter(target) || { x: SW() / 2, y: 140, n: 1 };
        var cine = { t: 0, c: c, done: done, icons: [] };
        toArray(s.items).forEach(function(id) {
            var info = items[id];
            if (!info || !info.image) return;
            var sp = new Sprite(ImageManager.loadPicture(info.image));
            sp.anchor.x = sp.anchor.y = 0.5;
            sp.visible = false;
            self._escFx.addChild(sp);
            cine.icons.push(sp);
        });
        cine.glow = new Sprite(fxGlow(256, '255,240,190'));
        cine.glow.anchor.x = cine.glow.anchor.y = 0.5;
        cine.glow.blendMode = 1;
        cine.glow.x = c.x;
        cine.glow.y = c.y;
        cine.glow.opacity = 0;
        cine.rays = new Sprite(fxRays(320));
        cine.rays.anchor.x = cine.rays.anchor.y = 0.5;
        cine.rays.blendMode = 1;
        cine.rays.x = c.x;
        cine.rays.y = c.y;
        cine.rays.opacity = 0;
        this._escFx.addChild(cine.rays);
        this._escFx.addChild(cine.glow);
        this._escCine = cine;
        $gameTemp.clearDestination();
    };

    Scene_Map.prototype.escUpdateGate = function() {
        var cine = this._escCine;
        var t = ++cine.t;
        var c = cine.c;
        var p = this.escPlayerPos();
        var self = this;
        // 1) 세 보물이 차례로 문으로 날아감
        cine.icons.forEach(function(sp, i) {
            var start = 10 + i * 24;
            if (t < start) return;
            var k = (t - start) / 40;
            if (k <= 1) {
                sp.visible = true;
                sp.x = p.x + (c.x - p.x) * k;
                sp.y = p.y - 20 + (c.y - p.y + 20) * k - Math.sin(k * Math.PI) * 70;
                sp.scale.x = sp.scale.y = 0.55 - k * 0.3;
                sp.rotation = Math.sin(k * 6) * 0.2;
            } else if (sp.visible) {
                sp.visible = false;
                self.escBurst(c.x, c.y, 18, '255,230,150', 3);
                if (!playSafeSe(SE_SOLVE, 90, 110 + i * 10)) SoundManager.playOk();
                cine.glow.opacity = Math.min(255, cine.glow.opacity + 70);
            }
        });
        // 2) 문이 커지며 빛을 빨아들임
        if (t === 92) {
            if (!playSafeSe(SE_GATE, 90, 100)) SoundManager.playRecovery();
            $gameScreen.startShake(3, 6, 110);
        }
        if (t > 92 && t <= 200) {
            var k2 = (t - 92) / 108;
            cine.glow.scale.x = cine.glow.scale.y = 1 + k2 * 2.2 + Math.sin(t / 6) * 0.06;
            cine.glow.opacity = 200 + k2 * 55;
            cine.rays.opacity = Math.min(230, k2 * 400);
            cine.rays.scale.x = cine.rays.scale.y = 0.8 + k2 * 1.6;
            if (t % 2 === 0) {
                var a = Math.random() * Math.PI * 2;
                var r = 260 + Math.random() * 120;
                this.escSpawn({ bitmap: fxSpark('255,236,170'), x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r,
                    tx: c.x, ty: c.y, life: 36, scale: 0.5 + Math.random() * 0.6, ds: -0.01, spin: 0.15 });
            }
        }
        cine.rays.rotation += 0.01 + (t > 92 ? (t - 92) / 3000 : 0);
        // 3) 주인공이 문으로 걸어 들어감
        if (t === 170) {
            $gamePlayer.setThrough(true);
            $gamePlayer.setDirection(8);
        }
        if (t >= 170 && t < 230 && !$gamePlayer.isMoving() && (t - 170) % 16 === 0) {
            $gamePlayer.moveStraight(8);
        }
        if (t >= 170 && t <= 230) {
            $gamePlayer.setOpacity(Math.max(0, 255 - (t - 170) * 4.5));
        }
        // 4) 하얗게
        if (t >= 190 && t <= 250) {
            this._escWhite.opacity = Math.min(255, (t - 190) / 60 * 255);
        }
        if (t === 262) {
            this._escFx.removeChild(cine.glow);
            this._escFx.removeChild(cine.rays);
            cine.icons.forEach(function(sp) { self._escFx.removeChild(sp); });
            $gamePlayer.setThrough(false);
            this._escCine = null;
            if (cine.done) cine.done();
        }
    };

    // --- 확대 그림 ---------------------------------------------------------------
    Scene_Map.prototype.escShowCloseup = function(name, maxScale) {
        var bmp = ImageManager.loadPicture(name);
        var sprite = this._escCloseup;
        var self = this;
        this._escCloseupName = name;
        if (this.escCloseupOverlays) this.escCloseupOverlays([]);
        sprite.bitmap = bmp;
        sprite.visible = false;
        this._escDim.visible = true;
        bmp.addLoadListener(function() {
            var maxW = SW() - 60;
            var maxH = self._escMsg.y - HUD_H - 60;
            var scale = Math.min(maxScale || 1, maxW / bmp.width, maxH / bmp.height);
            sprite.scale.x = scale;
            sprite.scale.y = scale;
            sprite.y = HUD_H + 10 + maxH / 2;
            sprite.visible = self._escCloseupName === name;
        });
    };

    Scene_Map.prototype.escCloseupOverlays = function(names) {
        var sprite = this._escCloseup; if (!sprite) return;
        if (sprite._escOv) sprite._escOv.forEach(function(c) { sprite.removeChild(c); });
        sprite._escOv = (names || []).map(function(n) {
            var c = new Sprite(ImageManager.loadPicture(n));
            c.anchor.x = sprite.anchor.x; c.anchor.y = sprite.anchor.y;
            sprite.addChild(c); return c;
        });
    };

    Scene_Map.prototype.escCloseupVisible = function() {
        return !!this._escCloseupName;
    };

    // 확대 그림을 HUD 아래 ~ bottom 사이에 맞춰 다시 배치
    Scene_Map.prototype.escFitCloseup = function(bottom) {
        var sprite = this._escCloseup;
        var bmp = sprite.bitmap;
        if (!bmp) return;
        var fit = function() {
            var maxW = SW() - 40;
            var maxH = bottom - HUD_H - 8;
            var scale = Math.min(1, maxW / bmp.width, maxH / bmp.height);
            sprite.scale.x = scale;
            sprite.scale.y = scale;
            sprite.y = HUD_H + 4 + maxH / 2;
        };
        if (bmp.isReady()) fit(); else bmp.addLoadListener(fit);
    };

    Scene_Map.prototype.escHideCloseup = function() {
        if (!this._escCloseup) return;
        this._escCloseupName = '';
        this._escCloseup.visible = false;
        this._escDim.visible = false;
    };

    Scene_Map.prototype.escCloseAll = function() {
        [this._escChoice, this._escNumpad, this._escBag, this._escDial, this._escTiming].forEach(function(w) {
            if (w) {
                w.deactivate();
                w.close();
            }
        });
        if (this._escMsg) this._escMsg.dismiss();
    };

    // --- 오류 화면 ---------------------------------------------------------------
    Scene_Map.prototype.escShowError = function(errors) {
        var text = '[데이터 파일 확인 필요]\n' + errors.slice(0, 12).join('\n');
        if (errors.length > 12) text += '\n... 외 ' + (errors.length - 12) + '개';
        console.error('EscapeRoom 데이터 오류:\n' + errors.join('\n'));
        var bmp = new Bitmap(SW(), SH());
        bmp.fillAll('#1a1010');
        bmp.fontSize = 20;
        var lines = wrapText(bmp, text, SW() - 60);
        for (var i = 0; i < lines.length && i < 22; i++) {
            bmp.textColor = i === 0 ? '#ffb070' : '#ffffff';
            bmp.drawText(lines[i], 30, 30 + i * 26, SW() - 60, 26, 'left');
        }
        this._escError.bitmap = bmp;
        this._escHud.bitmap.clear();
    };

    // --- 제작 도우미 -------------------------------------------------------------
    Scene_Map.prototype.escUpdateDebug = function() {
        var key = $gameMap.displayX() + ',' + $gameMap.displayY() + ',' + $gamePlayer.x + ',' + $gamePlayer.y;
        if (key === this._escDebugText) return;
        this._escDebugText = key;
        var bmp = this._escDebug.bitmap;
        bmp.clear();
        var tw = $gameMap.tileWidth();
        var th = $gameMap.tileHeight();
        var ox = $gameMap.displayX();
        var oy = $gameMap.displayY();
        for (var y = 0; y < $gameMap.height(); y++) {
            for (var x = 0; x < $gameMap.width(); x++) {
                var sx = (x - ox) * tw;
                var sy = (y - oy) * th;
                if (sx < -tw || sy < -th || sx > SW() || sy > SH()) continue;
                if ($gameMap.regionId(x, y) === WALL_REGION) {
                    bmp.fillRect(sx, sy, tw, th, 'rgba(255,40,40,0.28)');
                }
            }
        }
        $gameMap.events().forEach(function(ev) {
            var h = EscapeManager.hotspotForEvent(ev);
            var sx = (ev.x - ox) * tw;
            var sy = (ev.y - oy) * th;
            bmp.fillRect(sx + 2, sy + 2, tw - 4, th - 4, h ? 'rgba(255,230,0,0.35)' : 'rgba(120,200,255,0.3)');
            bmp.fontSize = 12;
            bmp.textColor = h ? '#fff27a' : '#bfe6ff';
            bmp.drawText(String(ev.event().name), sx, sy + th - 16, tw, 14, 'center');
        });
        bmp.fillRect(SW() - 210, SH() - 34, 206, 30, 'rgba(0,0,0,0.7)');
        bmp.fontSize = 16;
        bmp.textColor = '#7fffd4';
        bmp.drawText('맵 ' + $gameMap.mapId() + '번  x: ' + $gamePlayer.x + '  y: ' + $gamePlayer.y, SW() - 204, SH() - 34, 196, 30, 'left');
        var missing = EscapeManager._missing || [];
        if (missing.length > 0) {
            bmp.fillRect(4, SH() - 34, SW() - 220, 30, 'rgba(120,0,0,0.75)');
            bmp.textColor = '#ffffff';
            bmp.drawText('이벤트가 없는 조사 지점: ' + missing.join(', '), 10, SH() - 34, SW() - 232, 30, 'left');
        }
    };

    //=========================================================================
    // v3.4 어드벤처: 체력 · 함정 · 움직이는 것 · 활 · 어둠 · 아이템 효과 · 무작위 단계
    //   (데이터에 적었을 때만 켜짐 - 예전 게임에는 영향 없음)
    //=========================================================================
    var ADV = { tw: 48 };

    function advItemEffect(kind) {
        var M = EscapeManager, items = (M._data && M._data.items) || {};
        var n = 0;
        (M._items || []).forEach(function(id) {
            var it = items[id];
            if (it && it.effect) toArray(it.effect).forEach(function(e) { if (e === kind) n++; });
        });
        return n;
    }

    // --- 초기화 ---------------------------------------------------------------
    var _ER_reset = EscapeManager.reset;
    EscapeManager.reset = function() {
        _ER_reset.apply(this, arguments);
        var max = Number((this._data && this._data.hp) || 0);
        this._hpMax = max; this._hp = max;
        this._inv = 0;
        this._adv = null;
        this._arrowCool = 0;
    };

    // --- 무작위 단계 / 피해 / 회복 ---------------------------------------------
    var _ER_processStep = EscapeManager.processStep;
    EscapeManager.processStep = function(s) {
        if (s && s.random) {
            var list = toArray(s.random);
            var pick = list[Math.floor(Math.random() * list.length)];
            this.insertSteps(toArray(pick));
            return;
        }
        if (s && s['if'] !== undefined && (s.then || s['else'])) {
            this.insertSteps(toArray(this.checkCond(s['if']) ? (s.then || []) : (s['else'] || [])));
            return;
        }
        if (s && s.damage) this.advDamage(Number(s.damage), true);
        if (s && s.picture) {
            var _r = _ER_processStep.call(this, s), self = this;
            var ov = toArray(s.overlays).filter(function(o) { return o && o.picture && self.checkCond(o['if']); });
            if (this._scene && this._scene.escCloseupOverlays) this._scene.escCloseupOverlays(ov.map(function(o) { return String(o.picture); }));
            return _r;
        }
        if (s && s.heal) { this._hp = Math.min(this._hpMax, this._hp + Number(s.heal)); this.refreshHud(); }
        if (s && s.fullHeal) { this._hp = this._hpMax; this.refreshHud(); }
        return _ER_processStep.call(this, s);
    };

    // --- 체력 -----------------------------------------------------------------
    EscapeManager.advDamage = function(n, fromStep) {
        if (!this._hpMax) return;
        if (!fromStep && (this._inv > 0 || this._phase !== 'play')) return;
        this._hp = Math.max(0, this._hp - n);
        this._inv = 75;
        SoundManager.playActorDamage ? SoundManager.playActorDamage() : SoundManager.playBuzzer();
        $gameScreen.startFlash([255, 60, 40, 150], 16);
        $gameScreen.startShake(5, 9, 14);
        this.refreshHud();
        if (this._scene && this._scene.escShowToast) this._scene.escShowToast('❤ -' + n);
        if (this._hp <= 0 && !fromStep) this.advKnockout();
    };

    EscapeManager.advKnockout = function() {
        var room = this.currentRoom();
        this._hp = this._hpMax;
        var cp = toArray(room.checkpoint || room.start);
        var steps = toArray(room.ko || [{ speaker: '갑이', text: '으악, 기운이 다 빠졌어! 조금 앞에서 다시 해 보자.' }]).slice();
        var again = [];
        if (this._mission) {
            var m = this._mission; this._mission = null;
            if (this._scene && this._scene.escRefreshChase) this._scene.escRefreshChase();
            this.resetMission(m);
            again = m.def.retry === false ? [] : [{ mission: m.def }];
        }
        steps.push({ go: room.id, x: Number(cp[0]), y: Number(cp[1]), dir: cp[2] || 'up' });
        this._waiting = false;
        this._queue = steps.concat(again).concat(this._queue);
        if (!this._afterQueue) this._afterQueue = this.hideCloseup.bind(this);
    };

    // 부적(charm): 감시에 한 번 들켜도 넘어감
    var _ER_onCaught = EscapeManager.onCaught;
    EscapeManager.onCaught = function(w) {
        var items = (this._data && this._data.items) || {};
        for (var i = 0; i < this._items.length; i++) {
            var it = items[this._items[i]];
            if (it && toArray(it.effect).indexOf('charm') >= 0) {
                var id = this._items[i];
                this._items.splice(i, 1);
                this._watch.cool = 120;
                if (w && w.ev) w.ev.turnTowardPlayer();
                $gameScreen.startFlash([255, 240, 160, 160], 20);
                if (this._scene) this._scene.escShowToast((it.name || id) + ' 덕분에 들키지 않았다!');
                this.refreshHud();
                return;
            }
        }
        return _ER_onCaught.apply(this, arguments);
    };

    // --- 방에 들어갈 때: 함정 고르기, 움직이는 것 준비 --------------------------
    var _ER_setupWatchers = EscapeManager.setupWatchers;
    EscapeManager.setupWatchers = function() {
        _ER_setupWatchers.apply(this, arguments);
        var room = this.currentRoom();
        var adv = { traps: [], movers: [], arrows: [], last: null, dark: 0 };
        if (room && room.traps) {
            var T = room.traps;
            var cand = toArray(T.tiles).slice();
            var n = Math.min(cand.length, Number(T.count || cand.length));
            for (var i = cand.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = cand[i]; cand[i] = cand[j]; cand[j] = t; }
            for (var k = 0; k < n; k++) {
                var kind = T.kind === 'mixed' ? (Math.random() < 0.5 ? 'pit' : 'spike') : (T.kind || 'pit');
                adv.traps.push({ x: cand[k][0], y: cand[k][1], kind: kind, shown: kind !== 'pit', up: false,
                                 t: Math.floor(Math.random() * 150), dmg: Number(T.damage || 1) });
            }
        }
        if (room && room.movers) {
            toArray(room.movers).forEach(function(m) {
                var ev = $gameMap.events().filter(function(e) { return String(e.event().name).trim() === String(m.event); })[0];
                if (!ev) return;
                ev.setMoveSpeed(Number(m.speed || 4));
                ev.setThrough(true);
                adv.movers.push({ def: m, ev: ev, idx: 0, wait: Number(m.delay || 0) });
            });
        }
        adv.dark = room && room.dark ? Number(room.dark) : 0;
        this._adv = adv;
        if (this._scene && this._scene.escAdvBuild) this._scene.escAdvBuild();
    };

    // --- 매 프레임 -----------------------------------------------------------
    var _ER_update = EscapeManager.update;
    EscapeManager.update = function(scene) {
        _ER_update.apply(this, arguments);
        if (!this.isActive() || scene !== this._scene || this._phase !== 'play') return;
        this.advUpdate();
    };

    EscapeManager.advCond = function(def) {
        return !def || def['if'] === undefined || this.checkCond(def['if']);
    };

    EscapeManager.advUpdate = function() {
        var adv = this._adv; if (!adv) return;
        if (this._inv > 0) this._inv--;
        if (this._arrowCool > 0) this._arrowCool--;
        var busy = this.isBusy() && !this._mission && !this._chase;
        var p = $gamePlayer, px = p.x, py = p.y;
        var room = this.currentRoom();
        var trapOn = !room.trapsIf || this.checkCond(room.trapsIf);
        // 함정
        var self = this;
        adv.traps.forEach(function(t) {
            if (t.kind === 'spike') {
                if (!busy) t.t = (t.t + 1) % 150;
                t.up = trapOn && t.t < 55;
            }
        });
        if (!busy && trapOn && !p.isTransferring()) {
            var here = adv.traps.filter(function(t) { return t.x === px && t.y === py; })[0];
            if (here && !p.isMoving()) {
                if (here.kind === 'pit') {
                    here.shown = true;
                    this.advDamage(here.dmg);
                    if (adv.last && (adv.last[0] !== px || adv.last[1] !== py)) p.locate(adv.last[0], adv.last[1]);
                    if (this._scene) this._scene.escShowToast('앗, 함정이다!');
                } else if (here.up && this._inv === 0) {
                    this.advDamage(here.dmg);
                    if (adv.last && (adv.last[0] !== px || adv.last[1] !== py)) p.locate(adv.last[0], adv.last[1]);
                }
            }
        }
        if (!p.isMoving()) {
            var onTrap = adv.traps.some(function(t) { return t.x === p.x && t.y === p.y && (t.kind === 'pit' || t.up); });
            if (!onTrap) adv.last = [p.x, p.y];
        }
        // 움직이는 것 (굴러오는 돌, 움직이는 과녁 등)
        adv.movers.forEach(function(m) {
            var ev = m.ev;
            if (ev._erased || ev._escHidden) return;
            var on = self.advCond(m.def);
            if (!on || busy) return;
            if (!ev.isMoving()) {
                if (m.wait > 0) { m.wait--; }
                else {
                    var route = toArray(m.def.route);
                    if (route.length) {
                        var tgt = route[m.idx % route.length];
                        if (ev.x === tgt[0] && ev.y === tgt[1]) {
                            m.idx++;
                            if (m.def.loop === 'restart' && m.idx >= route.length) { m.idx = 1; ev.locate(route[0][0], route[0][1]); }
                            m.wait = Number(m.def.wait || 0);
                        } else {
                            var dx = tgt[0] - ev.x, dy = tgt[1] - ev.y;
                            var dir = Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 6 : 4) : (dy > 0 ? 2 : 8);
                            ev.setDirection(dir);
                            ev.setThrough(true);
                            ev.moveStraight(dir);
                        }
                    }
                }
            }
            if (m.def.damage && !p.isTransferring()) {
                var ex = Math.round(ev._realX), ey = Math.round(ev._realY);
                if (Math.abs(ev._realX - p._realX) < 0.7 && Math.abs(ev._realY - p._realY) < 0.7) {
                    self.advDamage(Number(m.def.damage));
                }
            }
        });
        // 화살
        var fire = (Input.isTriggered('escFire') || this._fireTap) && this.advCanFire();
        this._fireTap = false;
        if (fire) this.advFire();
        adv.arrows = adv.arrows.filter(function(a) { return self.advMoveArrow(a); });
    };

    // --- 활 -------------------------------------------------------------------
    EscapeManager.advBowOn = function() {
        var room = this.currentRoom();
        if (!room || !room.bow) return false;
        if (room.bow === true) return true;
        return this.checkCond(room.bow);
    };
    EscapeManager.advCanFire = function() {
        if (!this.advBowOn() || this._arrowCool > 0) return false;
        if (this.isBusy() && !this._mission && !this._chase) return false;
        return !$gamePlayer.isTransferring();
    };
    EscapeManager.advFire = function() {
        var p = $gamePlayer, d = p.direction();
        var a = { x: p._realX, y: p._realY, dx: d === 6 ? 1 : d === 4 ? -1 : 0, dy: d === 2 ? 1 : d === 8 ? -1 : 0, life: 40, sp: null };
        this._adv.arrows.push(a);
        this._arrowCool = 18;
        if (!playSafeSe('Bow1', 80, 110)) SoundManager.playCursor();
        if (this._scene && this._scene.escAdvArrowSprite) a.sp = this._scene.escAdvArrowSprite(a);
    };
    // 화면을 눌러 그 쪽으로 쏘기 (휴대폰·마우스)
    EscapeManager.advFireAt = function(mx, my) {
        var p = $gamePlayer;
        var vx = mx - p._realX, vy = my - p._realY, L = Math.hypot(vx, vy);
        if (L < 0.3) return;
        p.setDirection(Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 6 : 4) : (vy > 0 ? 2 : 8));
        var a = { x: p._realX, y: p._realY, dx: vx / L, dy: vy / L, life: 46, sp: null };
        this._adv.arrows.push(a);
        this._arrowCool = 18;
        if (!playSafeSe('Bow1', 80, 110)) SoundManager.playCursor();
        if (this._scene && this._scene.escAdvArrowSprite) a.sp = this._scene.escAdvArrowSprite(a);
    };
    EscapeManager.advMoveArrow = function(a) {
        var step = 0.34;
        a.x += a.dx * step; a.y += a.dy * step; a.life--;
        var tx = Math.round(a.x), ty = Math.round(a.y);
        var end = a.life <= 0 || !$gameMap.isValid(tx, ty);
        if (!end && $gameMap.regionId(tx, ty) === WALL_REGION) {
            // 벽 칸이라도 과녁 이벤트가 있으면 맞힘
            if (!$gameMap.eventsXy(tx, ty).some(function(e) { var h = EscapeManager.hotspotForEvent(e); return h && h.target && !e._escHidden; })) end = true;
        }
        if (!end) {
            var hit = null, self = this;
            $gameMap.events().forEach(function(e) {
                if (hit || e._erased || e._escHidden) return;
                var h = self.hotspotForEvent(e);
                if (!h || !h.target) return;
                if (Math.abs(e._realX - a.x) < 0.6 && Math.abs(e._realY - a.y) < 0.6) hit = { ev: e, h: h };
            });
            if (hit) { this.advHit(hit.ev, hit.h, a); end = true; }
        }
        if (end) {
            if (a.sp && a.sp.parent) a.sp.parent.removeChild(a.sp);
            return false;
        }
        return true;
    };
    EscapeManager.advHit = function(ev, h, a) {
        var scene = this._scene;
        if (scene) scene.escBurst(ev.screenX(), ev.screenY() - 24, 14, '255,230,140', 2.2);
        if (!playSafeSe('Damage1', 70, 130)) SoundManager.playOk();
        if (this._mission && this.missionTouch(ev)) return;
        var T = h.target === true ? {} : h.target;
        if (T.flag) { var self = this; toArray(T.flag).forEach(function(f) { self._flags[f] = true; }); this.refreshHud(); }
        if (T.steps && this.canInteract()) this.runSteps(toArray(T.steps), this.hideCloseup.bind(this));
        else if (T.steps) this.insertSteps(toArray(T.steps));
    };

    // 이동 속도 아이템
    var _GP_realMoveSpeed = Game_Player.prototype.realMoveSpeed;
    Game_Player.prototype.realMoveSpeed = function() {
        var s = _GP_realMoveSpeed.call(this);
        if (EscapeManager && EscapeManager.isActive && EscapeManager.isActive()) s += Math.min(1, advItemEffect('speed'));
        return s;
    };

    // 드러난 구덩이는 지나갈 수 없음
    var _GP_isMapPassable = Game_Player.prototype.isMapPassable;
    Game_Player.prototype.isMapPassable = function(x, y, d) {
        var M = EscapeManager;
        if (M && M._adv && M._adv.traps.length) {
            var x2 = $gameMap.roundXWithDirection(x, d), y2 = $gameMap.roundYWithDirection(y, d);
            if (M._adv.traps.some(function(t) { return t.kind === 'pit' && t.shown && t.x === x2 && t.y === y2; })) return false;
        }
        return _GP_isMapPassable.call(this, x, y, d);
    };

    Input.keyMapper[65] = 'escFire';     // A
    Input.keyMapper[70] = 'escFire';     // F

    // --- 화면: 함정·화살·어둠 그리기 ---------------------------------------------
    function advTrapBitmap(kind, up) {
        var b = new Bitmap(48, 48), c = b._context;
        if (kind === 'pit') {
            c.fillStyle = 'rgba(40,24,14,0.95)'; c.beginPath(); c.ellipse(24, 26, 19, 15, 0, 0, Math.PI * 2); c.fill();
            c.fillStyle = 'rgba(10,6,4,1)'; c.beginPath(); c.ellipse(24, 28, 14, 10, 0, 0, Math.PI * 2); c.fill();
            c.strokeStyle = 'rgba(120,90,60,1)'; c.lineWidth = 2; c.beginPath(); c.ellipse(24, 26, 19, 15, 0, 0, Math.PI * 2); c.stroke();
        } else {
            c.fillStyle = '#6e6458'; c.fillRect(4, 8, 40, 34); c.fillStyle = '#8a7f70'; c.fillRect(4, 8, 40, 4);
            for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {
                var x = 10 + i * 13, y = 16 + j * 10;
                if (up) { c.fillStyle = '#d8d0c0'; c.beginPath(); c.moveTo(x - 4, y + 6); c.lineTo(x, y - 8); c.lineTo(x + 4, y + 6); c.fill();
                          c.fillStyle = '#8a8070'; c.beginPath(); c.moveTo(x, y - 8); c.lineTo(x + 4, y + 6); c.lineTo(x, y + 6); c.fill(); }
                else { c.fillStyle = '#3a342c'; c.fillRect(x - 2, y, 4, 3); }
            }
        }
        b._setDirty ? b._setDirty() : (b._baseTexture && b._baseTexture.update());
        return b;
    }
    function advArrowBitmap() {
        var b = new Bitmap(32, 32), c = b._context;
        c.strokeStyle = '#8a5a30'; c.lineWidth = 2; c.beginPath(); c.moveTo(4, 16); c.lineTo(26, 16); c.stroke();
        c.fillStyle = '#d0d0d8'; c.beginPath(); c.moveTo(30, 16); c.lineTo(24, 12); c.lineTo(24, 20); c.fill();
        c.fillStyle = '#f0f0f0'; c.fillRect(3, 13, 5, 2); c.fillRect(3, 17, 5, 2);
        b._setDirty ? b._setDirty() : (b._baseTexture && b._baseTexture.update());
        return b;
    }
    function advHoleBitmap(r) {
        var D = r * 2, b = new Bitmap(D, D), c = b._context;
        var g = c.createRadialGradient(r, r, r * 0.35, r, r, r);
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.7, 'rgba(0,0,0,0.55)'); g.addColorStop(1, 'rgba(0,0,0,0.94)');
        c.fillStyle = g; c.fillRect(0, 0, D, D);
        b._setDirty ? b._setDirty() : (b._baseTexture && b._baseTexture.update());
        return b;
    }

    Scene_Map.prototype.escAdvBuild = function() {
        var tm = this._spriteset && this._spriteset._tilemap;
        if (this._escAdvSprites) this._escAdvSprites.forEach(function(s) { if (s.parent) s.parent.removeChild(s); });
        this._escAdvSprites = [];
        if (this._escDark) { if (this._escDark.parent) this._escDark.parent.removeChild(this._escDark); this._escDark = null; }
        var adv = EscapeManager._adv; if (!adv || !tm) return;
        this._escTrapBmp = this._escTrapBmp || { pit: advTrapBitmap('pit'), up: advTrapBitmap('spike', true), down: advTrapBitmap('spike', false) };
        var self = this;
        adv.traps.forEach(function(t) {
            var sp = new Sprite(self._escTrapBmp.pit);
            sp.z = 1; t.sp = sp; tm.addChild(sp); self._escAdvSprites.push(sp);
        });
        if (adv.dark > 0) {
            var cont = new Sprite();
            var r = Math.round((adv.dark + 2 * advItemEffect('light')) * 48);
            cont._hole = new Sprite(advHoleBitmap(r)); cont._r = r;
            cont._g = new PIXI.Graphics();
            cont.addChild(cont._g); cont.addChild(cont._hole);
            this._escFx.addChildAt(cont, 0);
            this._escDark = cont;
        }
    };

    Scene_Map.prototype.escAdvArrowSprite = function(a) {
        var tm = this._spriteset && this._spriteset._tilemap; if (!tm) return null;
        this._escArrowBmp = this._escArrowBmp || advArrowBitmap();
        var sp = new Sprite(this._escArrowBmp);
        sp.anchor.x = sp.anchor.y = 0.5; sp.z = 6;
        sp.rotation = Math.atan2(a.dy, a.dx);
        tm.addChild(sp);
        return sp;
    };

    var _SM_escUpdateFx = Scene_Map.prototype.escUpdateFx;
    Scene_Map.prototype.escUpdateFx = function() {
        _SM_escUpdateFx.apply(this, arguments);
        var adv = EscapeManager._adv; if (!adv) return;
        var tw = $gameMap.tileWidth(), th = $gameMap.tileHeight();
        var self = this;
        adv.traps.forEach(function(t) {
            if (!t.sp) return;
            t.sp.x = Math.round($gameMap.adjustX(t.x) * tw); t.sp.y = Math.round($gameMap.adjustY(t.y) * th);
            if (t.kind === 'pit') { t.sp.visible = t.shown; }
            else { t.sp.visible = true; t.sp.bitmap = t.up ? self._escTrapBmp.up : self._escTrapBmp.down; }
        });
        adv.arrows.forEach(function(a) {
            if (!a.sp) return;
            a.sp.x = Math.round($gameMap.adjustX(a.x) * tw + tw / 2); a.sp.y = Math.round($gameMap.adjustY(a.y) * th + th / 2 - 8);
        });
        if (this._escDark) {
            var rmD = EscapeManager.currentRoom(), da = rmD && rmD.darkArea;
            if (da) {   // v3.5: 어둠이 그 구역 안에서만
                var inD = $gamePlayer._realY <= da[3] + 0.5 && $gamePlayer._realY >= da[1] - 0.5 && $gamePlayer._realX >= da[0] - 0.5 && $gamePlayer._realX <= da[2] + 0.5;
                this._escDark.visible = inD;
            }
        }
        if (this._escDark && this._escDark.visible) {
            var d = this._escDark, r = d._r;
            var cx = $gamePlayer.screenX(), cy = $gamePlayer.screenY() - 20;
            d._hole.x = cx - r; d._hole.y = cy - r;
            var g = d._g; g.clear(); g.beginFill(0x000000, 0.94);
            var W = Graphics.width, H = Graphics.height;
            g.drawRect(0, 0, W, Math.max(0, cy - r));
            g.drawRect(0, cy + r, W, Math.max(0, H - cy - r));
            g.drawRect(0, cy - r, Math.max(0, cx - r), 2 * r);
            g.drawRect(cx + r, cy - r, Math.max(0, W - cx - r), 2 * r);
            g.endFill();
        }
        // 맞으면 깜빡임
        if (EscapeManager._inv > 0) $gamePlayer.setOpacity((Math.floor(EscapeManager._inv / 5) % 2) ? 90 : 255);
        else if ($gamePlayer.opacity() !== 255 && EscapeManager._hpMax > 0) $gamePlayer.setOpacity(255);
        if (this._escBowBtn) this._escBowBtn.visible = EscapeManager._phase === 'play' && EscapeManager.advBowOn();
    };

    // ===== v3.7 회상(세피아 + 낡은 필름) · 진흙 칸(리전 5) · 추위(방 "drain") =====
    //  방 "memory": true  → 화면 가장자리 어둡게 + 필름 무늬(img/pictures/fx_memory1·2) 겹치기
    //                      (색은 방 "tint": [40, 14, -34, 255] 처럼 함께 지정: 인물까지 모두 옛날 사진 색)
    //  리전 5 = 진흙: 걸음이 느려짐
    //  방 "drain": { "every": 600, "damage": 1, "text": "너무 추워!" } → 일정 시간마다 하트 -1
    //            아이템 "effect": "warm" 이 있으면 1.6배 느리게, 단계 { "heal": 1 } 에서 시간 다시 셈
    var _ER_setupWatchers37 = EscapeManager.setupWatchers;
    EscapeManager.setupWatchers = function() {
        _ER_setupWatchers37.apply(this, arguments);
        this._drainT = 0;
    };
    var _ER_advUpdate37 = EscapeManager.advUpdate;
    EscapeManager.advUpdate = function() {
        _ER_advUpdate37.apply(this, arguments);
        var room = this.currentRoom(); if (!room || !room.drain || !this._hpMax) return;
        var dr = room.drain;
        if (dr['if'] !== undefined && !this.checkCond(dr['if'])) return;
        if (this.isBusy() && !this._mission) return;
        var every = Number(dr.every || 900) * (advItemEffect('warm') > 0 ? 1.6 : 1);
        this._drainT = (this._drainT || 0) + 1;
        if (this._drainT >= every) {
            this._drainT = 0;
            if (this._scene) this._scene.escShowToast(dr.text || '너무 추워!');
            this.advDamage(Number(dr.damage || 1));
        }
    };
    var _ER_processStep37 = EscapeManager.processStep;
    EscapeManager.processStep = function(s) {
        if (s && typeof s === 'object' && (s.heal || s.fullHeal)) this._drainT = 0;
        return _ER_processStep37.apply(this, arguments);
    };
    var _ER_applyChar37 = EscapeManager.applyCharacter;
    EscapeManager.applyCharacter = function(c) {
        if (c && c.image) this._baseImage = String(c.image);
        return _ER_applyChar37.apply(this, arguments);
    };
    var _GP_rms37 = Game_Player.prototype.realMoveSpeed;
    Game_Player.prototype.realMoveSpeed = function() {
        var v = _GP_rms37.call(this);
        if (EscapeManager && EscapeManager.isRoomMap && EscapeManager.isRoomMap($gameMap.mapId()) && $gameMap.regionId(this.x, this.y) === 5) v -= 1.5;
        return v;
    };
    var _SM_escAdvBuild37 = Scene_Map.prototype.escAdvBuild;
    Scene_Map.prototype.escAdvBuild = function() {
        _SM_escAdvBuild37.apply(this, arguments);
        if (this._escMemory) { if (this._escMemory.parent) this._escMemory.parent.removeChild(this._escMemory); this._escMemory = null; }
        var room = EscapeManager.currentRoom();
        var lead = $gameParty.leader(), M7 = EscapeManager;
        if (lead && M7._baseImage) {
            var want = room && room.older ? M7._baseImage + '_old' : M7._baseImage;
            if (lead.characterName() !== want) { lead.setCharacterImage(want, lead.characterIndex()); $gamePlayer.refresh(); }
        }
        if (room && room.memory && this._escFx) {
            var sp = new Sprite();
            sp._a = ImageManager.loadPicture('fx_memory1'); sp._b = ImageManager.loadPicture('fx_memory2');
            sp.bitmap = sp._a;
            this._escFx.addChildAt(sp, 0);
            this._escMemory = sp;
        }
    };
    var _SM_escUpdateFx37 = Scene_Map.prototype.escUpdateFx;
    Scene_Map.prototype.escUpdateFx = function() {
        _SM_escUpdateFx37.apply(this, arguments);
        var m = this._escMemory;
        if (m) {
            var t = Graphics.frameCount;
            if (t % 6 === 0) m.bitmap = (Math.floor(t / 6) % 2) ? m._b : m._a;
            if (m.bitmap && m.bitmap.width > 1) { m.scale.x = Graphics.width / m.bitmap.width; m.scale.y = Graphics.height / m.bitmap.height; }
            m.opacity = 205 + Math.floor(Math.random() * 40);
        }
    };

    // --- 체력 하트 (위쪽 표시줄 아래 오른쪽) / 활 버튼 (오른쪽 아래 둥근 버튼) -----
    var _SM_escRefreshHud = Scene_Map.prototype.escRefreshHud;
    Scene_Map.prototype.escRefreshHud = function() {
        _SM_escRefreshHud.apply(this, arguments);
        var M = EscapeManager; if (!this._escHud) return;
        if (M._hpMax > 0) {
            if (!this._escHearts) {
                this._escHearts = new Sprite(new Bitmap(30 * 6 + 16, 34));
                this.addChildAt(this._escHearts, this.getChildIndex(this._escHud) + 1);
            }
            var b = this._escHearts.bitmap; b.clear();
            this._escHearts.x = SW() - b.width - 8; this._escHearts.y = HUD_H + 6;
            this._escHearts.visible = M._phase === 'play';
            var w = M._hpMax * 26 + 16;
            roundRect(b, b.width - w, 1, w - 1, 30, 14, 'rgba(30,10,10,0.6)', 'rgba(255,150,150,0.7)', 1.5);
            for (var i = 0; i < M._hpMax; i++) {
                b.fontSize = 22; b.textColor = i < M._hp ? '#ff5a6a' : 'rgba(255,255,255,0.28)';
                b.drawText('♥', b.width - w + 8 + i * 26, 0, 26, 32, 'center');
            }
        }
        if (!this._escBowBtn && M._data && JSON.stringify(M._data.rooms || []).indexOf('"bow"') >= 0) {
            var bb = new Bitmap(84, 84);
            bb._context.fillStyle = 'rgba(120,60,30,0.85)'; bb._context.beginPath(); bb._context.arc(42, 42, 38, 0, Math.PI * 2); bb._context.fill();
            bb._context.strokeStyle = 'rgba(255,230,180,0.9)'; bb._context.lineWidth = 3; bb._context.stroke();
            bb._setDirty ? bb._setDirty() : null;
            bb.fontSize = 30; bb.drawText('🏹', 0, 10, 84, 40, 'center');
            bb.fontSize = 15; bb.textColor = '#ffe9c0'; bb.drawText('활 (A)', 0, 48, 84, 22, 'center');
            this._escBowBtn = new Sprite(bb);
            this.addChildAt(this._escBowBtn, this.getChildIndex(this._escHud) + 1);
        }
        if (this._escBowBtn) { this._escBowBtn.x = SW() - 96; this._escBowBtn.y = SH() - 100; }
    };
    var _SM_processMapTouch2 = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function() {
        var b = this._escBowBtn;
        if (b && b.visible && TouchInput.isTriggered() && Math.hypot(TouchInput.x - b.x - 42, TouchInput.y - b.y - 42) < 44) {
            EscapeManager._fireTap = true; this._touchCount = 0; $gameTemp.clearDestination(); return;
        }
        if (b && b.visible && TouchInput.isPressed() && Math.hypot(TouchInput.x - b.x - 42, TouchInput.y - b.y - 42) < 44) return;
        var M = EscapeManager;
        if (TouchInput.isTriggered() && M._adv && M.advBowOn() && TouchInput.y > HUD_H) {
            var tw = $gameMap.tileWidth(), th = $gameMap.tileHeight();
            var mx = $gameMap.displayX() + TouchInput.x / tw - 0.5, my = $gameMap.displayY() + (TouchInput.y + 12) / th - 0.5;
            var ix = Math.round(mx), iy = Math.round(my);
            var aim = $gameMap.regionId(ix, iy) === 4;
            if (!aim) aim = $gameMap.events().some(function(e) {
                var h = M.hotspotForEvent(e);
                return h && h.target && !e._escHidden && Math.abs(e._realX - mx) < 0.8 && Math.abs(e._realY - my) < 0.9;
            });
            if (aim) {
                if (M.advCanFire()) M.advFireAt(mx, my);
                this._touchCount = 0; $gameTemp.clearDestination(); this._escAimHold = true; return;
            }
        }
        if (this._escAimHold) { if (TouchInput.isPressed()) return; this._escAimHold = false; }
        _SM_processMapTouch2.call(this);
    };

    //=========================================================================
    // 휴대폰·태블릿을 세로로 들었을 때 "가로로 돌려 주세요" 안내
    //=========================================================================
    (function() {
        var box = null, dismissed = false;
        function isTouchDevice() {
            return Utils.isMobileDevice() || ('ontouchstart' in window) || (navigator.maxTouchPoints > 1);
        }
        function block(e) { e.stopPropagation(); }
        function check() {
            var show = !dismissed && isTouchDevice() && window.innerHeight > window.innerWidth * 1.05;
            if (!box) {
                if (!show) return;
                box = document.createElement('div');
                box.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:200;display:flex;' +
                    'flex-direction:column;align-items:center;justify-content:center;background:rgba(12,10,8,0.92);' +
                    'color:#ffe9b0;font-family:GameFont,sans-serif;text-align:center;';
                box.innerHTML = '<div style="font-size:20vmin;line-height:1">&#x1F4F1;&#x21BB;</div>' +
                    '<div style="font-size:7vmin;margin-top:4vmin">화면을 <b>가로</b>로 돌려 주세요</div>' +
                    '<div style="font-size:4.2vmin;margin-top:2vmin;color:#cdbf9f;line-height:1.5">가로로 들면 게임 화면이 훨씬 크게 보여요.<br>' +
                    '(화면 자동 회전이 꺼져 있다면 켜 주세요)</div>' +
                    '<div id="escRotateSkip" style="margin-top:7vmin;padding:2.5vmin 6vmin;border:1px solid #8a7a5a;' +
                    'border-radius:2vmin;font-size:4.5vmin;color:#ffffff">그냥 세로로 할래요</div>';
                ['touchstart', 'touchmove', 'touchend', 'mousedown', 'mouseup', 'pointerdown', 'wheel'].forEach(function(n) {
                    box.addEventListener(n, block);
                });
                var skip = box.querySelector('#escRotateSkip');
                var onSkip = function(e) { e.preventDefault(); e.stopPropagation(); dismissed = true; check(); };
                skip.addEventListener('touchend', onSkip);
                skip.addEventListener('click', onSkip);
                document.body.appendChild(box);
            }
            box.style.setProperty('z-index', '1000', 'important');
            box.style.display = show ? 'flex' : 'none';
        }
        window.addEventListener('resize', check);
        window.addEventListener('orientationchange', function() { setTimeout(check, 300); });
        window.addEventListener('load', check);
        setTimeout(check, 0);
    })();
})();
