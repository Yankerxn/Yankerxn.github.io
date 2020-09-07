package service;

import frame.http.HttpCmd;
import utils.fileutils.HttpUtils;

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
        params = params.replace("%2F", "/");
        params = params.replace("%40", "@");
        String[] paramsArray = params.split("&");
        StringBuilder otherParams = new StringBuilder();
        for (int i = 1; i < paramsArray.length; i++) {
            otherParams.append(paramsArray[i]).append("&");
        }
        String other = "";
        if (otherParams.length() > 0) {
            other = otherParams.substring(0, otherParams.length() - 1);
        }
        String url = "http://cp.feiyien.com" + paramsArray[0].substring(4);
        String resultString = HttpUtils.post(url, other);
        result.put("msg", resultString);
        response(result);  //响应请求
    }
}
