package frame.http;

import frame.Server;

import java.net.InetSocketAddress;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class HttpServer extends Server {

	public HttpServer(int port) {
		super(port);
	}

	protected com.sun.net.httpserver.HttpServer server;
	
	protected ExecutorService executor = Executors.newCachedThreadPool();//线程池

	public void bootstrap() {
		try {
			server = com.sun.net.httpserver.HttpServer.create(new InetSocketAddress(port), 0);//http服务
			server.setExecutor(executor);//设置线程池
			server.createContext("/", new HttpHandler());//设置上下文,以及每个http请求的处理过程
			server.start();

			System.out.println("HttpServer bind: " + port);
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}

	public void shutdown() {
		executor.shutdown();
		server.stop(0);
		System.out.println("HttpServer unbind: " + port);
	}

}
