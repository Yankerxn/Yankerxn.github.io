package utils.fileutils;


import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;


/**
 * Http 访问工具类
 */
public class HttpUtils {

    /**
     * POST请求
     *
     * @param url   请求URL
     * @param param 请求参数，请求参数格式 name1=value1&name2=value2
     * @return
     */
    public static String post(String url, String param) {
        PrintWriter out = null;
        InputStream in = null;
        String result = "";
        try {
            URL realUrl = new URL(url);
            URLConnection conn = realUrl.openConnection();
            conn.setRequestProperty("Content-type", "application/x-www-form-urlencoded");
            conn.setRequestProperty("baoid", "com.feiyi.mathquick");
            conn.setRequestProperty("qu", "quick");
            conn.setRequestProperty("ver", "1.1.1");
            // 设置通用的请求属性
            conn.setRequestProperty("Accept-Charset", "UTF-8");
            conn.setRequestProperty("accept", "*/*");
            conn.setRequestProperty("connection", "Keep-Alive");
            conn.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)");
            // 发送POST请求必须设置如下两行
            conn.setDoOutput(true);
            conn.setDoInput(true);
            out = new PrintWriter(conn.getOutputStream());
            out.print(param);
            out.flush();

            in = conn.getInputStream();
            result = FileOperate.readTxt(in, "UTF-8");
            return result;
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                try {
                    if (out != null) {
                        out.close();
                    }
                } finally {
                    if (in != null) {
                        in.close();
                    }
                }
            } catch (Exception ex) {
            }
        }
    }
}
