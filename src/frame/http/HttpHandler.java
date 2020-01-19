package frame.http;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;

public class HttpHandler implements com.sun.net.httpserver.HttpHandler {

	@Override
	public void handle(HttpExchange http) throws IOException {
		try {
			String uri = http.getRequestURI().getPath();
			String cmd_id = uri;
			if (cmd_id == null || cmd_id.equals(""))
				return;
			//创建对象: 注册了该接口的实例
			HttpCmd cmd = HttpCmd.createInstance(cmd_id);
			if (cmd == null) {
				http.sendResponseHeaders(404, 0);
			} else {
				//请求头信息
				String remoteAddress = http.getRemoteAddress().toString();
				String method = http.getRequestMethod();
				String requestURI = http.getRequestURI().toString();
				System.out.println(remoteAddress + "\t" + method + "\t" + requestURI);

				cmd.http = http;
				cmd.method = method;

				//执行接口业务逻辑代码
				cmd.start();
			}
		} catch (Throwable e) {
			System.out.println("Handler error"+e.getMessage());
			responseError(http, e);
		} finally {
			try {
				http.close();
			} catch (Throwable e2) {
				e2.printStackTrace();
			}
		}
	}

	protected void responseError(HttpExchange http, Throwable t) {
		try {
			Headers responseHeaders = http.getResponseHeaders();
			responseHeaders.set("Content-type", "text/plain; charset=utf-8");
			responseHeaders.set("Access-Control-Allow-Origin", "*");

			OutputStream os = http.getResponseBody();

			http.sendResponseHeaders(200, 100000);

			t.printStackTrace(new PrintStream(os));
			os.flush();
		} catch (Throwable e) {
			System.out.println("response"+e.getMessage());
		}
	}

}
