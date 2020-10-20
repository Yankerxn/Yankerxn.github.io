package service;

import frame.http.HttpCmd;
import ocr.FileUtil;
import ocr.HttpUtil;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import sun.misc.BASE64Decoder;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

import static service.HttpConstant.OCR;

public class HttpOcr extends HttpCmd {

    //http接口需要继承 HttpCmd
    static {
        //注册接口
        HttpCmd.register("/search/" + OCR, HttpOcr.class);
    }

    @Override
    public void execute() {  //接口业务逻辑处理方法
        String params = readString();
        params = URLDecoder.decode(params);
        params = params.substring(5);
        try {
            String resultString = responseOrc(params);  //响应请求
            result.put("msg", resultString);
            response(result);  //响应请求
        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }
    }

    // 手写文字识别webapi接口地址
    private static final String WEBOCR_URL = "http://webapi.xfyun.cn/v1/service/v1/ocr/handwriting";
    // 应用APPID(必须为webapi类型应用,并开通手写文字识别服务,参考帖子如何创建一个webapi应用：http://bbs.xfyun.cn/forum.php?mod=viewthread&tid=36481)
    private static final String TEST_APPID = "5dd7987d";
    // 接口密钥(webapi类型应用开通手写文字识别后，控制台--我的应用---手写文字识别---相应服务的apikey)
    private static final String TEST_API_KEY = "74e55f606009502c026ad156155bc29e";

    /**
     * 组装http请求头
     *
     * @return
     * @throws UnsupportedEncodingException
     * @throws ParseException
     */
    private Map<String, String> constructHeader(String language, String location) throws UnsupportedEncodingException, ParseException {
        // 系统当前时间戳
        String X_CurTime = System.currentTimeMillis() / 1000L + "";
        // 业务参数
        String param = "{\"language\":\"" + language + "\"" + ",\"location\":\"" + location + "\"}";
        String X_Param = new String(Base64.encodeBase64(param.getBytes("UTF-8")));
        // 生成令牌 // 接口密钥
        String X_CheckSum = DigestUtils.md5Hex(TEST_API_KEY + X_CurTime + X_Param);
        // 组装请求头
        Map<String, String> header = new HashMap<String, String>();
        header.put("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        header.put("X-Param", X_Param);
        header.put("X-CurTime", X_CurTime);
        header.put("X-CheckSum", X_CheckSum);
        // 讯飞开放平台应用ID
        header.put("X-Appid", TEST_APPID);
        return header;
    }

    public String responseOrc(String data) throws IOException, ParseException {
        BASE64Decoder decoder = new BASE64Decoder();
        byte[] b = decoder.decodeBuffer(data.substring(22));
        FileOutputStream out = new FileOutputStream("D:\\1.png");
        out.write(b);
        out.close();
        Map<String, String> header = constructHeader("cn|en", "true");
        // 读取图像文件，转二进制数组，然后Base64编码
        byte[] imageByteArray = FileUtil.read2ByteArray("D:\\1.png");
        String imageBase64 = new String(Base64.encodeBase64(imageByteArray), "UTF-8");
        String bodyParam = "image=" + imageBase64;
        String result = HttpUtil.doPost(WEBOCR_URL, header, bodyParam);
        System.out.println(result);
        return result;
    }
}
