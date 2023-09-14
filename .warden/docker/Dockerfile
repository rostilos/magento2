FROM selenium/node-chrome:dev
USER root
COPY .warden/certs/ /etc/certs

RUN apt-get update -qqy \
  && apt-get -qqy install \
    libnss3-tools \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/* \

WORKDIR $HOME

RUN mkdir -p -m755 .pki/nssdb \
    && certutil -d sql:.pki/nssdb -N --empty-password \
    && certutil -d sql:.pki/nssdb -A -t "C,," -n den-cert -i /etc/certs/ca.cert.pem
