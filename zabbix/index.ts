import * as kubernetes from "@pulumi/kubernetes";

// Deploying the zabbix-server-mysql Helm chart to a Kubernetes cluster.
const zabbixChart = new kubernetes.helm.v3.Chart("zabbix-test", {
    chart: "zabbix",
    version: "4.3.0", // Replace with the appropriate chart version
    fetchOpts: {
        repo: "https://zabbix-community.github.io/helm-zabbix",
    },
    // If needed, you can provide custom values by specifying the `values` property.
     values: {
        zabbixImageTag: "ubuntu-6.0.20",
        postgresAccess: {
          useUnifiedSecret: true,
          unifiedSecretName: "zabbixdb-pguser-zabbix",
          unifiedSecretAutoCreate: true,
          host: "zabbix-postgresql",
          port: "5432",
          user: "zabbix",
          password: "egarreo01",
          database: "zabbix"
        },
         zabbixServer: {
             enabled: true,
             replicaCount: 1,
             image: {
              repository: "zabbix/zabbix-server-pgsql",
              tag: null,
              pullPolicy: "IfNotPresent"
             },
             service: {
                 type: "NodePort",
                 ports: {
                    port: 80,
                    targetPort: 10051,
                    nodePort: 31051
                  },
             },
         },
         postgresql: {
          eabled: true,
          image: {
            repository: "postgres",
            tag: 15,
            pullPolicy: "IfNotPresent",
      },
          service: {
             type: "ClusterIP",
             port: 5432,
            },
          },
        zabbixWeb: {
          enables: true,
          replicaCount: 1,
          image: {
            repository: "zabbix/zabbix-web-nginx-pgsql",
            tag: null,
            pullPolicy: "IfNotPresent"
      },
         service: {
          type: "NodePort",
          port: 80,
          targetPort: 80,
          nodePort: 31080
      },
    },
          
         }
});
