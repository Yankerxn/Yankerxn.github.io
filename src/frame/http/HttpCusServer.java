package frame.http;

import com.sun.net.httpserver.HttpsConfigurator;
import com.sun.net.httpserver.HttpsServer;
import frame.Server;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import java.io.File;
import java.io.FileInputStream;
import java.net.InetSocketAddress;
import java.security.KeyStore;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class HttpCusServer extends Server {

    public HttpCusServer(int port) {
        super(port);
    }

    protected com.sun.net.httpserver.HttpsServer server;

    protected ExecutorService executor = Executors.newCachedThreadPool();//线程池

    public void bootstrap() {
        try {
//            server = com.sun.net.httpserver.HttpServer.create(new InetSocketAddress(port), 0);//http服务
//            server.setExecutor(executor);//设置线程池
//            server.createContext("/", new HttpHandler());//设置上下文,以及每个http请求的处理过程
//            server.start();

            //实现HTTPS SERVER
            File file = new File("D:\\JavaProject\\yankercn.jks");
            FileInputStream fis = new FileInputStream(file);

            server = HttpsServer.create(new InetSocketAddress(port), 0); //设置HTTPS端口这443
            KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());   //建立证书库
            ks.load(fis, "yankercn566".toCharArray()); //载入证书
            KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509"); //建立一个密钥管理工厂
            kmf.init(ks, "yankercn566".toCharArray()); //初始工厂
            SSLContext sslContext = SSLContext.getInstance("SSLv3"); //建立证书实体
            sslContext.init(kmf.getKeyManagers(), null, null); //初始化证书
            HttpsConfigurator conf = new HttpsConfigurator(sslContext); //在https配置
            server.setHttpsConfigurator(conf); //在https server载入配置
            server.setExecutor(null); // creates a default executor
            server.createContext("/", new HttpHandler());// 用MyHandler类内处理到/的请求
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
